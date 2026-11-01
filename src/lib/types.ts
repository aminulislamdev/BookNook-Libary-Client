export const CATEGORIES = ["Fiction", "Science", "History", "Kids", "Others"] as const;
export type Category = (typeof CATEGORIES)[number];

export type User = {
  id: string;
  name: string;
  email: string;
  image?: string;
};

export type Book = {
  id: string;
  title: string;
  author: string;
  category: Category;
  description: string;
  image: string;
  totalCopies: number;
  availableCopies: number;
  addedBy: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  userId?: string;
  userName?: string;
  userEmail?: string;
  createdAt: string;
  updatedAt: string;
};

export type Borrow = {
  id: string;
  bookId: string;
  bookTitle: string;
  bookImage: string;
  userId: string;
  userName: string;
  userEmail: string;
  borrowDate: string;
  returnDate: string;
  returnedAt: string | null;
  status: "active" | "returned";
  book?: Book | null;
};

export type BooksResponse = {
  books: Book[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type BorrowsResponse = {
  borrows: Borrow[];
};