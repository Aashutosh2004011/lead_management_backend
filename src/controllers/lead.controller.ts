import { Request, Response } from 'express';
import prisma from '../config/database';
import { LeadQueryInput } from '../validations/lead.validation';
import { PaginatedResponse, AnalyticsData } from '../types';
import { Lead } from '@prisma/client';

export const getLeads = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      search,
      stage,
      status,
      source,
      country,
      sortBy,
      sortOrder,
      page,
      limit,
    } = req.query as unknown as LeadQueryInput;

    const skip = ((page as number) - 1) * (limit as number);

    // Build filter conditions
    const where: any = {};

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (stage) where.stage = stage;
    if (status) where.status = status;
    if (source) where.source = source;
    if (country) where.country = country;

    // Get total count
    const total = await prisma.lead.count({ where });

    // Get paginated leads
    const leads = await prisma.lead.findMany({
      where,
      skip,
      take: limit as number,
      orderBy: {
        [sortBy as string]: sortOrder,
      },
    });

    const response: PaginatedResponse<Lead> = {
      data: leads,
      pagination: {
        total,
        page: page as number,
        limit: limit as number,
        totalPages: Math.ceil(total / (limit as number)),
      },
    };

    res.json(response);
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getLeadById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const lead = await prisma.lead.findUnique({
      where: { id },
    });

    if (!lead) {
      res.status(404).json({ error: 'Lead not found' });
      return;
    }

    res.json(lead);
  } catch (error) {
    console.error('Get lead by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    // Total leads
    const totalLeads = await prisma.lead.count();

    // Converted leads
    const convertedLeads = await prisma.lead.count({
      where: { status: 'CONVERTED' },
    });

    // Active leads
    const activeLeads = await prisma.lead.count({
      where: { status: 'ACTIVE' },
    });

    // Total and average value
    const valueAggregation = await prisma.lead.aggregate({
      _sum: { value: true },
      _avg: { value: true },
    });

    // Leads by stage
    const leadsByStageRaw = await prisma.lead.groupBy({
      by: ['stage'],
      _count: true,
    });

    const leadsByStage = leadsByStageRaw.reduce((acc, item) => {
      acc[item.stage] = item._count;
      return acc;
    }, {} as Record<string, number>);

    // Leads by status
    const leadsByStatusRaw = await prisma.lead.groupBy({
      by: ['status'],
      _count: true,
    });

    const leadsByStatus = leadsByStatusRaw.reduce((acc, item) => {
      acc[item.status] = item._count;
      return acc;
    }, {} as Record<string, number>);

    // Leads by source (top 10)
    const leadsBySourceRaw = await prisma.lead.groupBy({
      by: ['source'],
      _count: true,
      orderBy: {
        _count: {
          source: 'desc',
        },
      },
      take: 10,
    });

    const leadsBySource = leadsBySourceRaw.map((item) => ({
      source: item.source,
      count: item._count,
    }));

    const analytics: AnalyticsData = {
      totalLeads,
      convertedLeads,
      activeLeads,
      totalValue: valueAggregation._sum.value || 0,
      averageValue: valueAggregation._avg.value || 0,
      leadsByStage: leadsByStage as any,
      leadsByStatus: leadsByStatus as any,
      leadsBySource,
    };

    res.json(analytics);
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
