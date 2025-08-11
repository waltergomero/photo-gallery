# 📸 Pixels Photo Gallery

A modern, responsive photo gallery application built with Next.js 15, TypeScript, and Prisma. Features user authentication, image management, category organization, and a beautiful responsive UI.

## ✨ Features

- **🎨 Modern UI**: Responsive design with Tailwind CSS
- **🔐 Authentication**: Secure user authentication with NextAuth.js
- **📁 Category Management**: Organize photos by categories
- **🖼️ Image Optimization**: Automatic image optimization and lazy loading
- **📱 Mobile Responsive**: Works perfectly on all devices
- **⚡ Performance**: Optimized for speed with Next.js 15
- **🔍 Search**: Search through photos and categories
- **👤 Admin Panel**: Admin interface for managing photos and users
- **🎪 Lightbox**: Beautiful lightbox for viewing photos
- **📊 Analytics**: Track photo views and user engagement

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Bun or npm/yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/waltergomero/photo-gallery.git
   cd photo-gallery
   ```

2. **Install dependencies**
   ```bash
   bun install
   # or
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/photo_gallery"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   bun dev
   # or
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
photo-gallery/
├── app/                    # Next.js 13+ app directory
│   ├── (admin)/           # Admin routes
│   ├── (auth)/            # Authentication routes
│   ├── (root)/            # Public routes
│   └── api/               # API routes
├── components/            # Reusable components
│   ├── gallery/          # Gallery-specific components
│   ├── ui/               # UI components
│   └── admin/            # Admin components
├── actions/              # Server actions
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── types/                # TypeScript type definitions
├── prisma/               # Database schema and migrations
├── public/               # Static assets
└── styles/               # Global styles
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Bootstrap 5
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Image Processing**: Sharp (via Next.js)
- **State Management**: React Hooks
- **Deployment**: Vercel (recommended)

## 📊 Database Schema

### Key Models

- **User**: User accounts with admin capabilities
- **UserImages**: Photo storage with metadata
- **Category**: Photo categorization
- **Session**: User sessions for authentication

## 🔧 Configuration

### Image Upload Settings

- **Supported formats**: JPEG, PNG, WebP, GIF
- **Maximum file size**: 10MB
- **Automatic optimization**: Yes
- **Lazy loading**: Yes

### Security Features

- **Rate limiting**: API endpoint protection
- **Input validation**: Comprehensive input sanitization
- **CSRF protection**: Built-in CSRF token validation
- **Content Security Policy**: Secure headers configuration
- **File upload security**: File type and size validation

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Set environment variables in Vercel dashboard**
3. **Deploy automatically on push**

### Manual Deployment

1. **Build the application**
   ```bash
   bun run build
   ```

2. **Start the production server**
   ```bash
   bun start
   ```

## 🔍 API Endpoints

### Public Endpoints
- `GET /api/images` - Fetch public images
- `GET /api/categories` - Fetch categories

### Protected Endpoints
- `POST /api/images` - Upload new image (admin)
- `DELETE /api/images/:id` - Delete image (admin)
- `PUT /api/images/:id` - Update image (admin)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Prisma](https://prisma.io/) for the excellent ORM
- [NextAuth.js](https://next-auth.js.org/) for authentication
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework

## 📞 Support

If you have any questions or issues, please:

1. Check the [documentation](https://github.com/waltergomero/photo-gallery/wiki)
2. Search [existing issues](https://github.com/waltergomero/photo-gallery/issues)
3. Create a [new issue](https://github.com/waltergomero/photo-gallery/issues/new)

---

**Made with ❤️ by Walter Gomero**
