export interface Cinema {
  _id: string;
  name: string;
  bundleSizes: number[];
}

export interface BookingBreakdown {
  bundleSize: number;
  quantity: number;
}

export interface BookingQuote {
  possible: boolean;
  cinema?: string;
  groupSize: number;
  totalBundles?: number;
  selectedBundles?: number[];
  bundleBreakdown?: BookingBreakdown[];
  message?: string;
}
