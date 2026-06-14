# Plan: Tối ưu SEO, Google Merchant Center & Tracking GA4
Created: 2026-06-14T17:30
Status: 🟡 In Progress

## Overview
Triển khai bộ công cụ tối ưu hóa tìm kiếm (SEO), đồng bộ sản phẩm lên Google Merchant Center (GMC) miễn phí, và cài đặt Google Analytics 4 (GA4) với Event Tracking. Thông tin cấu hình GA4 sẽ được lưu trữ động trong Database (bảng `shop_config`).

## Tech Stack
- Frontend: Next.js Metadata, `@next/third-parties/google`
- Backend: Next.js API Routes (Route Handlers) để generate XML Feed
- Database: Prisma (PostgreSQL) - update bảng `shop_config`

## Phases

| Phase | Name | Status | Progress |
|-------|------|--------|----------|
| 01 | Database Schema Update | ✅ Complete | 100% |
| 02 | Schema Markup (JSON-LD) | ✅ Complete | 100% |
| 03 | Google Merchant Center Feed | ✅ Complete | 100% |
| 04 | GA4 Tracking Integration | ✅ Complete | 100% |

## Quick Commands
- Start Phase 1: `/code phase-01`
- Check progress: `/next`
- Save context: `/save-brain`
