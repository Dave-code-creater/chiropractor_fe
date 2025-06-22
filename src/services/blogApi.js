import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth, CACHE_TIMES } from "./baseApi";
import { cacheUtils, CACHE_DURATION, CACHE_NAMESPACES } from "../utils/cache";

// Mock blog data for development/testing
const mockCategories = [
  {
    id: "cat-1",
    name: "Platform Introduction",
    slug: "platform-introduction",
    description: "Introduction to ChiroCare platform and features",
    color: "#10b981",
    postCount: 1
  },
  {
    id: "cat-2",
    name: "Health Tips",
    slug: "health-tips",
    description: "Practical advice for maintaining good health",
    color: "#3b82f6",
    postCount: 2
  },
  {
    id: "cat-3", 
    name: "Exercise & Fitness",
    slug: "exercise-fitness",
    description: "Workout routines and fitness guidance",
    color: "#ef4444",
    postCount: 1
  },
  {
    id: "cat-4",
    name: "Nutrition",
    slug: "nutrition", 
    description: "Dietary advice and nutrition facts",
    color: "#f59e0b",
    postCount: 1
  },
  {
    id: "cat-5",
    name: "Mental Health",
    slug: "mental-health",
    description: "Mental wellness and stress management",
    color: "#8b5cf6",
    postCount: 1
  }
];

const mockPosts = [
  {
    id: "welcome-to-chirocare",
    title: "Welcome to ChiroCare: Your Complete Healthcare Management Platform",
    slug: "welcome-to-chirocare-healthcare-platform",
    excerpt: "Discover how ChiroCare revolutionizes healthcare management with comprehensive tools for appointments, health tracking, expert consultations, and personalized care plans.",
    content: `Welcome to ChiroCare, your all-in-one healthcare management platform designed to put you in control of your health journey. Whether you're seeking chiropractic care, managing chronic conditions, or simply maintaining optimal wellness, ChiroCare provides everything you need in one convenient, secure platform.

## What Makes ChiroCare Different?

ChiroCare isn't just another healthcare app – it's a comprehensive ecosystem built around your unique health needs. We combine cutting-edge technology with personalized care to deliver an experience that's both powerful and intuitive.

### 🏥 Comprehensive Healthcare Services
- **Expert Chiropractic Care**: Connect with licensed chiropractors for spinal health, pain management, and mobility improvement
- **Specialized Treatments**: Access to various therapeutic approaches including physical therapy, massage therapy, and wellness counseling
- **Preventive Care**: Proactive health screenings and wellness programs to keep you healthy
- **Emergency Support**: 24/7 access to healthcare professionals for urgent concerns

### 📱 Smart Platform Features

## Intelligent Appointment Scheduling
Our advanced booking system makes scheduling effortless:
- **Doctor-First Selection**: Choose your preferred healthcare provider first, then see their available locations and times
- **Real-Time Availability**: Live updates on appointment slots with instant confirmation
- **Automated Reminders**: SMS and email notifications to keep you on track
- **Easy Rescheduling**: Modify appointments with just a few taps

## Comprehensive Health Dashboard
Your personal health command center includes:
- **Appointment Overview**: See all upcoming and past appointments at a glance
- **Health Metrics Tracking**: Monitor vital signs, pain levels, and recovery progress
- **Treatment History**: Complete record of all treatments and outcomes
- **Medication Management**: Track prescriptions and set reminder alerts

## Secure Messaging & Consultations
Stay connected with your healthcare team:
- **Direct Doctor Communication**: Secure messaging with your healthcare providers
- **Virtual Consultations**: Video calls for follow-ups and routine check-ins
- **Care Team Coordination**: Seamless communication between all your healthcare providers
- **Educational Resources**: Access to personalized health information and tips

## Advanced Health Reporting
Our comprehensive reporting system helps you and your doctors make informed decisions:
- **Detailed Health Assessments**: Complete intake forms with intelligent branching logic
- **Pain Mapping**: Visual body diagrams to accurately describe symptoms
- **Progress Tracking**: Charts and graphs showing your health journey over time
- **Insurance Integration**: Streamlined claims processing and coverage verification

## Your Health, Your Way

### Personalized Care Plans
Every patient is unique, and your care plan should be too. ChiroCare creates personalized treatment recommendations based on:
- Your specific health conditions and symptoms
- Treatment history and response patterns
- Lifestyle factors and personal preferences
- Evidence-based medical protocols

### Educational Resources
Knowledge is power when it comes to your health. Our platform provides:
- **Expert Articles**: Regular blog posts from healthcare professionals
- **Treatment Explanations**: Clear information about procedures and therapies
- **Home Exercise Programs**: Customized exercise routines for your conditions
- **Wellness Tips**: Daily advice for maintaining optimal health

### Community Support
Connect with others on similar health journeys:
- **Patient Success Stories**: Inspiring accounts of recovery and wellness
- **Support Groups**: Virtual communities for specific conditions
- **Expert Q&A Sessions**: Regular opportunities to ask questions
- **Wellness Challenges**: Fun, engaging ways to improve your health habits

## Privacy & Security First

Your health information is precious, and we treat it that way:
- **HIPAA Compliance**: Full adherence to healthcare privacy regulations
- **End-to-End Encryption**: Your data is protected at every step
- **Secure Cloud Storage**: Enterprise-grade security for all health records
- **Access Controls**: You decide who can see your information and when

## Getting Started is Easy

### 1. Create Your Profile
Set up your account with basic information and health history. Our intelligent onboarding process guides you through each step.

### 2. Complete Your Health Assessment
Our comprehensive intake process creates a detailed picture of your health status, concerns, and goals.

### 3. Connect with Providers
Browse our network of qualified healthcare professionals and choose the ones that best fit your needs.

### 4. Schedule Your First Appointment
Use our streamlined booking process to schedule your initial consultation at a convenient time and location.

### 5. Begin Your Health Journey
Start receiving personalized care, track your progress, and achieve your wellness goals.

## Why Patients Choose ChiroCare

### ⭐ "Life-Changing Experience"
*"ChiroCare transformed how I manage my chronic back pain. The ability to track symptoms, communicate with my chiropractor between visits, and access educational resources has been incredible."* - Sarah M.

### ⭐ "Incredibly Convenient"
*"Scheduling appointments used to be such a hassle. Now I can book, reschedule, and even have virtual consultations all from my phone. The platform is so user-friendly."* - Michael R.

### ⭐ "Comprehensive Care"
*"I love having all my health information in one place. My doctors can see my complete history, and I can track my progress over time. It's like having a personal health assistant."* - Jennifer L.

## Ready to Transform Your Healthcare Experience?

Join thousands of patients who have already discovered the ChiroCare difference. Whether you're dealing with acute pain, managing a chronic condition, or simply want to optimize your health, our platform provides the tools, expertise, and support you need to succeed.

**Start your journey today:**
1. Sign up for your free account
2. Complete your health profile
3. Schedule your first appointment
4. Experience healthcare the way it should be

## Stay Connected

Follow our blog for regular updates on:
- Latest healthcare innovations and treatments
- Wellness tips and healthy living advice
- Platform updates and new features
- Success stories from our patient community
- Expert insights from our healthcare providers

Welcome to ChiroCare – where your health journey begins, and your wellness goals become reality.`,
    status: "published",
    category: "platform-introduction",
    tags: ["chirocare", "healthcare-platform", "introduction", "features", "wellness", "appointments"],
    author: {
      id: "chirocare-team",
      name: "ChiroCare Team",
      email: "team@chirocare.com"
    },
    featuredImage: {
      url: "/images/chirocare-welcome.jpg",
      alt: "ChiroCare healthcare platform dashboard",
      caption: "Your comprehensive healthcare management platform"
    },
    publishDate: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000).toISOString(), // Published 12 hours ago to be most recent
    readTime: 12,
    views: 2847,
    likes: 156,
    seo: {
      metaTitle: "Welcome to ChiroCare - Complete Healthcare Management Platform",
      metaDescription: "Discover ChiroCare's comprehensive healthcare platform featuring appointment scheduling, health tracking, expert consultations, and personalized care plans.",
      keywords: ["chirocare", "healthcare platform", "appointment scheduling", "health management", "chiropractic care"]
    },
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "post-1",
    title: "5 Essential Stretches for Lower Back Pain Relief",
    slug: "5-essential-stretches-lower-back-pain-relief",
    excerpt: "Discover five simple yet effective stretches that can help reduce lower back pain and improve your daily comfort.",
    content: `Lower back pain affects millions of people worldwide. In this comprehensive guide, we'll explore five essential stretches that can help alleviate discomfort and improve mobility.

## 1. Cat-Cow Stretch
This gentle movement helps improve spinal flexibility and relieves tension in the lower back.

## 2. Child's Pose
A restorative pose that gently stretches the lower back and hips.

## 3. Knee-to-Chest Stretch
Helps relieve tension in the lower back and improves flexibility.

## 4. Piriformis Stretch
Targets the deep muscle in the buttocks that can contribute to lower back pain.

## 5. Spinal Twist
Improves spinal mobility and helps release tension.

Remember to hold each stretch for 15-30 seconds and breathe deeply throughout the movements.`,
    status: "published",
    category: "health-tips",
    tags: ["back-pain", "stretching", "wellness", "exercise"],
    author: {
      id: "author-1",
      name: "Dr. Sarah Johnson",
      email: "dr.johnson@clinic.com"
    },
    featuredImage: {
      url: "/images/back-stretches.jpg",
      alt: "Person doing back stretches",
      caption: "Gentle stretches can provide significant relief for lower back pain"
    },
    publishDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    readTime: 5,
    views: 1247,
    likes: 89,
    seo: {
      metaTitle: "5 Essential Stretches for Lower Back Pain Relief | Health Tips",
      metaDescription: "Learn five effective stretches to relieve lower back pain and improve mobility. Expert advice from healthcare professionals.",
      keywords: ["back pain", "stretches", "exercise", "wellness"]
    },
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "post-2",
    title: "The Importance of Proper Posture in Daily Life",
    slug: "importance-proper-posture-daily-life",
    excerpt: "Learn how maintaining good posture can prevent pain and improve your overall health and well-being.",
    content: `Good posture is more than just standing up straight. It's about maintaining the natural curves of your spine and keeping your body in proper alignment.

## Why Posture Matters
Poor posture can lead to:
- Chronic back and neck pain
- Reduced lung capacity
- Digestive issues
- Decreased energy levels

## Tips for Better Posture
1. Keep your shoulders back and relaxed
2. Engage your core muscles
3. Position your computer screen at eye level
4. Take regular breaks to move and stretch

## Exercises to Improve Posture
Regular strengthening and stretching exercises can help maintain good posture throughout the day.`,
    status: "published",
    category: "health-tips",
    tags: ["posture", "spine-health", "workplace-wellness"],
    author: {
      id: "author-2", 
      name: "Dr. Michael Chen",
      email: "dr.chen@clinic.com"
    },
    featuredImage: {
      url: "/images/posture.jpg",
      alt: "Person demonstrating good posture",
      caption: "Proper posture alignment for optimal health"
    },
    publishDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    readTime: 4,
    views: 892,
    likes: 67,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "post-3",
    title: "Nutrition Tips for Faster Recovery After Exercise",
    slug: "nutrition-tips-faster-recovery-exercise",
    excerpt: "Optimize your post-workout nutrition to enhance recovery, reduce soreness, and improve performance.",
    content: `What you eat after exercise plays a crucial role in how quickly your body recovers and adapts to training.

## The Recovery Window
The first 30-60 minutes after exercise is often called the "recovery window" - a time when your body is primed to replenish energy stores and repair muscle tissue.

## Key Nutrients for Recovery

### Protein
Aim for 20-30 grams of high-quality protein within 2 hours of exercise to support muscle repair and growth.

### Carbohydrates  
Replenish glycogen stores with complex carbohydrates, especially after intense or prolonged exercise.

### Fluids and Electrolytes
Replace fluids lost through sweat and restore electrolyte balance.

## Best Recovery Foods
- Greek yogurt with berries
- Chocolate milk
- Lean chicken with sweet potato
- Quinoa salad with vegetables
- Banana with almond butter

Remember, consistency in your nutrition habits is just as important as what you eat immediately after exercise.`,
    status: "published", 
    category: "nutrition",
    tags: ["nutrition", "recovery", "exercise", "protein"],
    author: {
      id: "author-3",
      name: "Dr. Emily Rodriguez",
      email: "dr.rodriguez@clinic.com"
    },
    featuredImage: {
      url: "/images/nutrition-recovery.jpg",
      alt: "Healthy post-workout meal",
      caption: "Proper nutrition supports faster recovery and better performance"
    },
    publishDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    readTime: 6,
    views: 634,
    likes: 45,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "post-4",
    title: "Managing Stress: Techniques for Mental Wellness",
    slug: "managing-stress-techniques-mental-wellness",
    excerpt: "Explore evidence-based strategies for managing stress and maintaining mental health in today's fast-paced world.",
    content: `Stress is a natural part of life, but chronic stress can have serious impacts on both physical and mental health.

## Understanding Stress
Stress triggers the body's "fight or flight" response, releasing hormones like cortisol and adrenaline. While this response can be helpful in short bursts, prolonged activation can lead to health problems.

## Effective Stress Management Techniques

### Deep Breathing
Practice diaphragmatic breathing to activate the body's relaxation response.

### Mindfulness and Meditation
Regular mindfulness practice can help you stay present and reduce anxiety about future events.

### Physical Exercise
Regular physical activity is one of the most effective stress relievers.

### Time Management
Organize your day and prioritize tasks to reduce feelings of overwhelm.

### Social Support
Maintain connections with friends and family who can provide emotional support.

## When to Seek Help
If stress is significantly impacting your daily life, consider speaking with a mental health professional.`,
    status: "published",
    category: "mental-health", 
    tags: ["stress-management", "mental-health", "mindfulness", "wellness"],
    author: {
      id: "author-4",
      name: "Dr. James Wilson",
      email: "dr.wilson@clinic.com"
    },
    featuredImage: {
      url: "/images/stress-management.jpg",
      alt: "Person meditating in peaceful setting",
      caption: "Mindfulness and meditation are powerful tools for stress management"
    },
    publishDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    readTime: 7,
    views: 1156,
    likes: 98,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "post-5",
    title: "Building a Home Workout Routine That Actually Works",
    slug: "building-home-workout-routine-that-works",
    excerpt: "Create an effective home fitness routine with minimal equipment and maximum results.",
    content: `Working out at home has become increasingly popular, offering convenience and flexibility for busy lifestyles.

## Benefits of Home Workouts
- No commute time to the gym
- Work out on your schedule
- Privacy and comfort
- Cost-effective long-term
- No equipment sharing

## Essential Equipment for Home Workouts
You don't need a lot of equipment to get started:
- Resistance bands
- Dumbbells or kettlebells
- Yoga mat
- Stability ball

## Sample Weekly Routine

### Monday: Upper Body Strength
- Push-ups (3 sets of 10-15)
- Dumbbell rows (3 sets of 12)
- Shoulder press (3 sets of 10)
- Plank (3 sets of 30 seconds)

### Wednesday: Lower Body Strength  
- Squats (3 sets of 15)
- Lunges (3 sets of 10 each leg)
- Glute bridges (3 sets of 15)
- Wall sit (3 sets of 30 seconds)

### Friday: Full Body Circuit
Combine upper and lower body exercises in a circuit format for cardiovascular and strength benefits.

## Staying Motivated
- Set realistic goals
- Track your progress
- Find a workout buddy (even virtually)
- Vary your routine to prevent boredom

Remember, consistency is more important than perfection. Start with what you can manage and gradually increase intensity and duration.`,
    status: "published",
    category: "exercise-fitness",
    tags: ["home-workout", "fitness", "exercise", "strength-training"],
    author: {
      id: "author-1",
      name: "Dr. Sarah Johnson", 
      email: "dr.johnson@clinic.com"
    },
    featuredImage: {
      url: "/images/home-workout.jpg",
      alt: "Home workout setup with equipment",
      caption: "A simple home gym setup can provide effective workouts"
    },
    publishDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    readTime: 8,
    views: 723,
    likes: 56,
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Posts", "Categories", "Media"],
  // Enhanced caching configuration
  keepUnusedDataFor: CACHE_TIMES.MEDIUM,
  refetchOnMountOrArgChange: 30, // Refetch if data is older than 30 seconds
  refetchOnFocus: false, // Don't refetch on window focus to save bandwidth
  refetchOnReconnect: true, // Refetch when connection is restored
  endpoints: (builder) => ({
    // Post Management
    fetchPosts: builder.query({
      providesTags: (result, error, params) => [
        "Posts",
        { type: "Posts", id: `LIST-${JSON.stringify(params)}` }
      ],
      transformResponse: (response) => {
        if (response.success && response.metadata) {
          return response.metadata;
        }
        return response;
      },
      // Enhanced caching with custom cache key
      serializeQueryArgs: ({ queryArgs }) => {
        const { page, ...otherArgs } = queryArgs;
        return otherArgs;
      },
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page && arg.page > 1) {
          // For pagination, append new items
          return {
            ...newItems,
            posts: [...(currentCache.posts || []), ...(newItems.posts || [])]
          };
        }
        return newItems;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
      keepUnusedDataFor: CACHE_TIMES.MEDIUM,
      // Mock implementation for development - using mock data directly
      async queryFn(params, _queryApi, _extraOptions, fetchWithBQ) {
        // Use mock data directly for development
        let filteredPosts = [...mockPosts];
        
        if (params.category && params.category !== 'all') {
          filteredPosts = filteredPosts.filter(post => post.category === params.category);
        }
        
        if (params.status) {
          filteredPosts = filteredPosts.filter(post => post.status === params.status);
        }
        
        if (params.search) {
          const searchLower = params.search.toLowerCase();
          filteredPosts = filteredPosts.filter(post => 
            post.title.toLowerCase().includes(searchLower) ||
            post.excerpt.toLowerCase().includes(searchLower) ||
            post.tags.some(tag => tag.toLowerCase().includes(searchLower))
          );
        }
        
        // Sort by publish date (newest first)
        filteredPosts.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
        
        const result = {
          success: true,
          statusCode: 200,
          metadata: {
            posts: filteredPosts,
            pagination: {
              page: params.page || 1,
              limit: params.limit || 10,
              total: filteredPosts.length,
              pages: Math.ceil(filteredPosts.length / (params.limit || 10))
            }
          }
        };
        
        return { data: result };
      }
    }),
    
    getPost: builder.query({
      query: (slug) => ({ url: `blog/posts/${slug}` }),
      providesTags: (_res, _err, slug) => [{ type: "Posts", id: slug }],
      keepUnusedDataFor: CACHE_TIMES.LONG, // Individual posts can be cached longer
      // Mock implementation for development
      async queryFn(slug, _queryApi, _extraOptions, fetchWithBQ) {
        try {
          // Check cache first
          const cached = cacheUtils.blog.getPost(slug);
          if (cached) {
            console.log(`Blog post cache hit for ${slug}`);
            return { data: cached };
          }

          const result = await fetchWithBQ({
            url: `blog/posts/${slug}`,
          });
          
          // Cache the result
          if (result.data) {
            cacheUtils.blog.setPost(slug, result.data, CACHE_DURATION.LONG);
          }
          
          return result;
        } catch (error) {
          // Fallback to mock data
          console.warn("Blog API not available, using mock data");
          const post = mockPosts.find(p => p.slug === slug || p.id === slug);
          
          if (post) {
            const result = {
              success: true,
              statusCode: 200,
              metadata: { post }
            };
            
            // Cache mock data
            cacheUtils.blog.setPost(slug, result, CACHE_DURATION.LONG);
            
            return { data: result };
          } else {
            return {
              error: {
                status: 404,
                data: {
                  success: false,
                  statusCode: 404,
                  message: "Post not found"
                }
              }
            };
          }
        }
      }
    }),

    createPost: builder.mutation({
      query: (data) => ({
        url: "blog/posts",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Posts"],
      // Clear cache on create
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Clear blog posts cache
          cacheUtils.blog.clearAll();
        } catch (error) {
          console.error("Failed to create post:", error);
        }
      },
    }),

    updatePost: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `blog/posts/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_res, _err, { id }) => [{ type: "Posts", id }, "Posts"],
      // Clear cache on update
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Clear specific post cache and posts list cache
          cacheUtils.blog.clearAll();
        } catch (error) {
          console.error("Failed to update post:", error);
        }
      },
    }),

    deletePost: builder.mutation({
      query: (id) => ({
        url: `blog/posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _err, id) => [{ type: "Posts", id }, "Posts"],
      // Clear cache on delete
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Clear all blog cache
          cacheUtils.blog.clearAll();
        } catch (error) {
          console.error("Failed to delete post:", error);
        }
      },
    }),

    // Category Management
    fetchCategories: builder.query({
      providesTags: ["Categories"],
      keepUnusedDataFor: CACHE_TIMES.VERY_LONG, // Categories change rarely
      transformResponse: (response) => {
        if (response.success && response.metadata) {
          return response.metadata;
        }
        return response;
      },
      // Mock implementation for development - using mock data directly
      async queryFn(_params, _queryApi, _extraOptions, fetchWithBQ) {
        return {
          data: {
            success: true,
            statusCode: 200,
            metadata: { categories: mockCategories }
          }
        };
      }
    }),

    createCategory: builder.mutation({
      query: (data) => ({
        url: "blog/categories",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Categories"],
    }),

    updateCategory: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `blog/categories/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Categories"],
    }),

    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `blog/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Categories"],
    }),

    // Media Management
    uploadMedia: builder.mutation({
      query: (formData) => ({
        url: "blog/media/upload",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Media"],
    }),

    fetchMedia: builder.query({
      query: (params = {}) => ({
        url: "blog/media",
        params: {
          type: params.type,
          page: params.page,
          limit: params.limit,
        },
      }),
      providesTags: ["Media"],
      keepUnusedDataFor: CACHE_TIMES.LONG,
    }),
  }),
});

export const {
  useFetchPostsQuery,
  useGetPostQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useFetchCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useUploadMediaMutation,
  useFetchMediaQuery,
} = blogApi;
