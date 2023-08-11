interface ITour {
  name: string;
  slug: string;
  duration: number;
  maxGroupSize: number;
  difficulty: "easy" | "medium" | "difficult";
  ratingsAverage: number;
  ratingsQuantity: number;
  price: number;
  priceDiscount?: number;
  summary: string;
  description?: string;
  imageCover: string;
  images: string[];
  startDates: Date[];
  secretTour: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default ITour;
