import { FileText, Download, TrendingUp, Clock } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import type { PDFAnalytics } from '../types';

/**
 * PDFAnalytics - Display PDF reading materials analytics
 * 
 * Features:
 * - 4 key metrics in responsive card layout
 * - Formatted numbers with commas (e.g., "1,234 downloads")
 * - Relative time formatting (e.g., "2 days ago")
 * - Loading state with skeleton UI
 * - Null-safe handling for empty analytics
 * - FUTA brand colors and styling
 * - Responsive grid (1 column mobile, 2 tablet, 4 desktop)
 * 
 * @param analytics - PDF analytics data object
 * @param isLoading - Loading state flag
 * 
 * @example
 * <PDFAnalytics
 *   analytics={analyticsData}
 *   isLoading={false}
 * />
 */

interface PDFAnalyticsProps {
  analytics: PDFAnalytics;
  isLoading: boolean;
}

export function PDFAnalytics({ analytics, isLoading }: PDFAnalyticsProps) {
  // ===========================
  // UTILITY FUNCTIONS
  // ===========================

  /**
   * Format number with commas (e.g., 1234 -> "1,234")
   * @param num - Number to format
   * @returns Formatted number string
   */
  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US');
  };

  /**
   * Format date as relative time (e.g., "2 days ago")
   * @param dateString - ISO 8601 date string
   * @returns Formatted relative time string
   */
  const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    // Less than a minute
    if (diffInSeconds < 60) {
      return 'Just now';
    }

    // Less than an hour
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    }

    // Less than a day
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    }

    // Less than a week
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    }

    // Less than a month
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
      return `${diffInWeeks} ${diffInWeeks === 1 ? 'week' : 'weeks'} ago`;
    }

    // Less than a year
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
    }

    // Years
    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`;
  };

  // ===========================
  // RENDER FUNCTIONS
  // ===========================

  /**
   * Render skeleton loading state for a metric card
   */
  const renderSkeletonCard = () => (
    <Card className="bg-white border-futa-gray-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            {/* Skeleton title */}
            <div className="h-4 w-24 bg-futa-gray-200 rounded animate-pulse" />
            {/* Skeleton value */}
            <div className="h-8 w-20 bg-futa-gray-200 rounded animate-pulse" />
            {/* Skeleton subtitle */}
            <div className="h-3 w-32 bg-futa-gray-200 rounded animate-pulse" />
          </div>
          {/* Skeleton icon */}
          <div className="w-12 h-12 bg-futa-gray-200 rounded-lg animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );

  /**
   * Render metric card
   */
  const renderMetricCard = (
    icon: React.ReactNode,
    title: string,
    value: string,
    subtitle: string,
    iconBgColor: string,
    iconColor: string
  ) => (
    <Card className="bg-white border-futa-gray-200 hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <p className="text-sm text-futa-gray-600">{title}</p>
            <p className="text-2xl font-semibold text-futa-gray-900">{value}</p>
            <p className="text-xs text-futa-gray-500">{subtitle}</p>
          </div>
          <div className={`w-12 h-12 rounded-lg ${iconBgColor} flex items-center justify-center shrink-0`}>
            <div className={iconColor}>
              {icon}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // ===========================
  // MAIN RENDER
  // ===========================

  // Show loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {renderSkeletonCard()}
        {renderSkeletonCard()}
        {renderSkeletonCard()}
        {renderSkeletonCard()}
      </div>
    );
  }

  // Prepare metric data
  const totalMaterialsValue = formatNumber(analytics.totalMaterials);
  const totalMaterialsSubtitle = analytics.totalMaterials === 1 
    ? 'PDF material available' 
    : 'PDF materials available';

  const totalDownloadsValue = formatNumber(analytics.totalDownloads);
  const totalDownloadsSubtitle = analytics.totalDownloads === 1 
    ? 'Total download' 
    : 'Total downloads';

  const mostDownloadedValue = analytics.mostDownloadedMaterial
    ? formatNumber(analytics.mostDownloadedMaterial.downloadCount)
    : 'N/A';
  const mostDownloadedSubtitle = analytics.mostDownloadedMaterial
    ? analytics.mostDownloadedMaterial.title
    : 'No materials yet';

  const mostRecentValue = analytics.mostRecentMaterial
    ? formatRelativeTime(analytics.mostRecentMaterial.uploadDate)
    : 'N/A';
  const mostRecentSubtitle = analytics.mostRecentMaterial
    ? analytics.mostRecentMaterial.title
    : 'No materials yet';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Materials */}
      {renderMetricCard(
        <FileText className="w-6 h-6" />,
        'Total Materials',
        totalMaterialsValue,
        totalMaterialsSubtitle,
        'bg-blue-100',
        'text-blue-600'
      )}

      {/* Total Downloads */}
      {renderMetricCard(
        <Download className="w-6 h-6" />,
        'Total Downloads',
        totalDownloadsValue,
        totalDownloadsSubtitle,
        'bg-primary/10',
        'text-primary'
      )}

      {/* Most Downloaded */}
      {renderMetricCard(
        <TrendingUp className="w-6 h-6" />,
        'Most Downloaded',
        mostDownloadedValue,
        mostDownloadedSubtitle,
        'bg-purple-100',
        'text-purple-600'
      )}

      {/* Most Recent */}
      {renderMetricCard(
        <Clock className="w-6 h-6" />,
        'Most Recent',
        mostRecentValue,
        mostRecentSubtitle,
        'bg-orange-100',
        'text-orange-600'
      )}
    </div>
  );
}
