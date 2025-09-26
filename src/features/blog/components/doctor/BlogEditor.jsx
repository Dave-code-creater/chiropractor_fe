import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useCreateBlogPostMutation, useUpdateBlogPostMutation } from "@/api/services/blogApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Link,
  Image,
  Code,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Save,
  Eye,
  Upload,
  X,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

const BLOG_CATEGORIES = [
  { value: "chiropractic-care", label: "Chiropractic Care" },
  { value: "spine-health", label: "Spine Health" },
  { value: "pain-management", label: "Pain Management" },
  { value: "wellness", label: "Wellness & Prevention" },
  { value: "exercise", label: "Exercise & Therapy" },
  { value: "nutrition", label: "Nutrition & Lifestyle" },
  { value: "patient-stories", label: "Patient Stories" },
  { value: "clinic-news", label: "Clinic News" },
];

const BlogEditor = ({ initialPost = null, onSave, onCancel }) => {
  const navigate = useNavigate();
  const { id: userId } = useParams();
  const userRole = useSelector((state) => state.auth.role);
  const editorRef = useRef(null);
  const [createPost, { isLoading: isCreating }] = useCreateBlogPostMutation();
  const [updatePost, { isLoading: isUpdating }] = useUpdateBlogPostMutation();

  const [formData, setFormData] = useState({
    title: initialPost?.title || "",
    content: initialPost?.content || "",
    excerpt: initialPost?.excerpt || "",
    category: initialPost?.category || "",
    tags: initialPost?.tags || [],
    featured_image: initialPost?.featured_image || "",
    is_published: initialPost?.is_published || false,
    meta_description: initialPost?.meta_description || "",
    slug: initialPost?.slug || "",
  });

  const [currentTag, setCurrentTag] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [editorContent, setEditorContent] = useState(initialPost?.content || "");

  useEffect(() => {
    if (formData.title && !initialPost) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title, initialPost]);

  useEffect(() => {
    if (editorRef.current) {
      const content = initialPost?.content || '';
      editorRef.current.innerHTML = content;
      setEditorContent(content);
    }
  }, [initialPost]);

  useEffect(() => {
    if (!showPreview && editorRef.current) {
      editorRef.current.innerHTML = editorContent;
  
      const range = document.createRange();
      range.selectNodeContents(editorRef.current);
      range.collapse(false);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [showPreview]);

  const formatText = (command, value = null) => {
    if (!editorRef.current) return;
    
    editorRef.current.focus();
    
    switch (command) {
    case 'bold':
      document.execCommand('bold', false, null);
      break;
    case 'italic':
      document.execCommand('italic', false, null);
      break;
    case 'underline':
      document.execCommand('underline', false, null);
      break;
    case 'insertUnorderedList':
      document.execCommand('insertUnorderedList', false, null);
      break;
    case 'insertOrderedList':
      document.execCommand('insertOrderedList', false, null);
      break;
    case 'h1':
      document.execCommand('formatBlock', false, 'h1');
      break;
    case 'h2':
      document.execCommand('formatBlock', false, 'h2');
      break;
    case 'h3':
      document.execCommand('formatBlock', false, 'h3');
      break;
    case 'blockquote':
      document.execCommand('formatBlock', false, 'blockquote');
      break;
    case 'pre':
      document.execCommand('formatBlock', false, 'pre');
      break;
    case 'paragraph':
      document.execCommand('formatBlock', false, 'p');
      break;
    default:
  document.execCommand(command, false, value);
    }
    
    handleContentChange();
  };

  const insertImage = () => {
    if (imageUrl && editorRef.current) {
      editorRef.current.focus();
      document.execCommand('insertImage', false, imageUrl);
      setImageUrl("");
      setShowImageDialog(false);
      handleContentChange();
    }
  };

  const insertLink = () => {
    const url = prompt("Enter URL:");
    if (url && editorRef.current) {
      editorRef.current.focus();
      document.execCommand('createLink', false, url);
      handleContentChange();
    }
  };

  const handleTagAdd = () => {
    if (currentTag.trim()) {
      const newTags = currentTag
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)
        .filter(tag => !formData.tags.includes(tag));
      
      if (newTags.length > 0) {
        setFormData(prev => {
          const updated = {
        ...prev,
            tags: [...prev.tags, ...newTags]
          };

          return updated;
        });
      }
      setCurrentTag("");
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setFormData(prev => {
      const updated = {
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
      };

      return updated;
    });
  };

  const handleContentChange = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setEditorContent(newContent);
      setFormData(prev => {
        const updated = {
        ...prev,
          content: newContent
        };

        return updated;
      });
    }
  };

  const parseContentToBlocks = (htmlContent) => {
    if (!htmlContent)
      return [];
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    const blocks = [];
    
    Array.from(tempDiv.children).forEach(element => {
      const tagName = element.tagName.toLowerCase();
      const text = element.textContent.trim();
      
      if (!text)
        return;
      
      switch (tagName) {
      case 'h1':
        blocks.push({ type: 'heading', level: 1, text });
        break;
      case 'h2':
        blocks.push({ type: 'heading', level: 2, text });
        break;
      case 'h3':
        blocks.push({ type: 'heading', level: 3, text });
        break;
      case 'ul':
        const ulItems = Array.from(element.querySelectorAll('li')).map(li => li.textContent.trim());
        if (ulItems.length > 0) {
          blocks.push({ type: 'list', ordered: false, items: ulItems });
        }
        break;
      case 'ol':
        const olItems = Array.from(element.querySelectorAll('li')).map(li => li.textContent.trim());
        if (olItems.length > 0) {
          blocks.push({ type: 'list', ordered: true, items: olItems });
        }
        break;
      case 'blockquote':
        blocks.push({ type: 'blockquote', text });
        break;
      case 'pre':
        blocks.push({ type: 'code', text });
        break;
      case 'img':
        blocks.push({ 
          type: 'image', 
          src: element.getAttribute('src') || '', 
          alt: element.getAttribute('alt') || '' 
        });
        break;
      case 'p':
      default:
        if (element.innerHTML !== element.textContent) {
          const hasLinks = element.querySelectorAll('a').length > 0;
          const hasStrong = element.querySelectorAll('strong').length > 0;
          const hasEm = element.querySelectorAll('em').length > 0;
          
          blocks.push({ 
            type: 'paragraph', 
            text,
            formatting: {
              hasLinks,
              hasStrong,
              hasEm
            },
            html: element.innerHTML
          });
        } else {
          blocks.push({ type: 'paragraph', text });
  }
        break;
      }
    });
    
    if (blocks.length === 0 && htmlContent.trim()) {
      blocks.push({ type: 'paragraph', text: tempDiv.textContent.trim() });
    }
    
    return blocks;
  };

  const handleSubmit = async (isDraft = false) => {
    try {
      const htmlContent = editorRef.current?.innerHTML || editorContent || formData.content;
      const blocks = parseContentToBlocks(htmlContent);
      
      const postData = {
        ...formData,
        is_published: isDraft ? false : formData.is_published,
        content: blocks,
      };



      let result;
      if (initialPost?.id) {
        result = await updatePost({ id: initialPost.id, ...postData }).unwrap();
        toast.success("Blog post updated successfully!");
      } else {
        result = await createPost(postData).unwrap();
        toast.success("Blog post created successfully!");
      }



      if (onSave) {
        onSave(result);
      } else {
        navigate(`/dashboard/${userRole}/${userId}/blog/management`);
      }
    } catch (error) {
      toast.error("Failed to save blog post");
      console.error("Error saving post:", error);
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <div className="h-full w-full p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold tracking-tight">
          {initialPost ? "Edit Blog Post" : "Create New Blog Post"}
        </h1>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setShowPreview(!showPreview)}
            className="text-base"
          >
            <Eye className="h-5 w-5 mr-2" />
            {showPreview ? "Edit" : "Preview"}
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => handleSubmit(true)}
            disabled={isLoading}
            className="text-base"
          >
            Save Draft
          </Button>
          <Button
            size="lg"
            onClick={() => handleSubmit(false)}
            disabled={isLoading || !formData.title || !formData.content}
            className="text-base"
          >
            <Save className="h-5 w-5 mr-2" />
            {formData.is_published ? "Update" : "Publish"}
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <Card className="shadow-md">
            <CardHeader className="p-6">
              <CardTitle className="text-2xl">Post Content</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <Label htmlFor="title" className="text-lg mb-2">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => {
                    const newTitle = e.target.value;
                    setFormData(prev => ({ ...prev, title: newTitle }));
                  }}
                  placeholder="Enter post title..."
                  className="text-xl font-semibold h-14"
                />
              </div>

              <div>
                <Label htmlFor="slug" className="text-lg mb-2">URL Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="post-url-slug"
                  className="h-12"
                />
              </div>

              {!showPreview ? (
                <div className="space-y-3">
                  <Label className="text-lg">Content</Label>
                  
                  <div className="border border-gray-200 rounded-t-md p-3 bg-gray-50 flex flex-wrap gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => formatText('bold')}
                      className="h-10 w-10 p-0"
                    >
                      <Bold className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => formatText('italic')}
                      className="h-10 w-10 p-0"
                    >
                      <Italic className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => formatText('underline')}
                      className="h-10 w-10 p-0"
                    >
                      <Underline className="h-5 w-5" />
                    </Button>
                    
                    <Separator orientation="vertical" className="h-6" />
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => formatText('h1')}
                      className="h-10 w-10 p-0"
                    >
                      <Heading1 className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => formatText('h2')}
                      className="h-10 w-10 p-0"
                    >
                      <Heading2 className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => formatText('h3')}
                      className="h-10 w-10 p-0"
                    >
                      <Heading3 className="h-5 w-5" />
                    </Button>
                    
                    <Separator orientation="vertical" className="h-6" />
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => formatText('insertUnorderedList')}
                      className="h-10 w-10 p-0"
                    >
                      <List className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => formatText('insertOrderedList')}
                      className="h-10 w-10 p-0"
                    >
                      <ListOrdered className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => formatText('blockquote')}
                      className="h-10 w-10 p-0"
                    >
                      <Quote className="h-5 w-5" />
                    </Button>
                    
                    <Separator orientation="vertical" className="h-6" />
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={insertLink}
                      className="h-10 w-10 p-0"
                    >
                      <Link className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowImageDialog(true)}
                      className="h-10 w-10 p-0"
                    >
                      <Image className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => formatText('pre')}
                      className="h-10 w-10 p-0"
                    >
                      <Code className="h-5 w-5" />
                    </Button>
                  </div>

                  <div
                    ref={editorRef}
                    contentEditable
                    dir="ltr"
                    onInput={handleContentChange}
                    className="min-h-[600px] p-6 border border-gray-200 rounded-b-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg blog-editor-content"
                    style={{ 
                      lineHeight: '1.6'
                    }}
                    suppressContentEditableWarning={true}
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <Label className="text-lg">Preview</Label>
                  <div className="min-h-[600px] p-6 border border-gray-200 rounded-md bg-gray-50">
                    <h1 className="text-3xl font-bold mb-6">{formData.title}</h1>
                    <div
                      className="prose prose-lg max-w-none"
                      dangerouslySetInnerHTML={{ __html: editorContent }}
                    />
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="excerpt" className="text-lg mb-2">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => {
                    const newExcerpt = e.target.value;
                    setFormData(prev => ({ ...prev, excerpt: newExcerpt }));
                  }}
                  placeholder="Brief description of the post..."
                  rows={4}
                  className="text-base"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          

          <Card className="shadow-md">
            <CardHeader className="p-6">
              <CardTitle className="text-xl">Category</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Select
                value={formData.category}
                onValueChange={(value) => {
                  const selectedCategory = BLOG_CATEGORIES.find(cat => cat.value === value);
                  setFormData(prev => ({ ...prev, category: value }));
                }}
              >
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {BLOG_CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value} className="text-base">
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="p-6">
              <CardTitle className="text-xl">Tags</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                    placeholder="Add tags (separate with commas)..."
                  className="h-12 text-base"
                  onKeyPress={(e) => e.key === 'Enter' && handleTagAdd()}
                />
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleTagAdd}
                  disabled={!currentTag.trim()}
                >
                  <Plus className="h-5 w-5" />
                </Button>
                </div>
                <p className="text-sm text-gray-500">
                  Example: "health, wellness, chiropractic, pain relief"
                </p>
                {currentTag.trim() && (
                  <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-md">
                    <span className="text-sm text-gray-600">Preview:</span>
                    {currentTag
                      .split(',')
                      .map(tag => tag.trim())
                      .filter(tag => tag.length > 0)
                      .filter((tag, index, array) => array.indexOf(tag) === index)
                      .map((tag, index) => (
                        <Badge key={`preview-${index}`} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={`tag-${index}-${tag}`} variant="secondary" className="text-sm px-3 py-1">
                    {tag}
                    <button
                      onClick={() => handleTagRemove(tag)}
                      className="ml-2 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="p-6">
              <CardTitle className="text-xl">Featured Image</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <Input
                value={formData.featured_image}
                onChange={(e) => setFormData(prev => ({ ...prev, featured_image: e.target.value }))}
                placeholder="Image URL..."
                className="h-12 text-base"
              />
              {formData.featured_image && (
                <img
                  src={formData.featured_image}
                  alt="Featured"
                  className="w-full h-48 object-cover rounded-md"
                />
              )}
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="p-6">
              <CardTitle className="text-xl">SEO</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div>
                <Label htmlFor="meta_description" className="text-base mb-2">Meta Description</Label>
                <Textarea
                  id="meta_description"
                  value={formData.meta_description}
                  onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                  placeholder="SEO description..."
                  rows={4}
                  className="text-base"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">Insert Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="imageUrl" className="text-base mb-2">Image URL</Label>
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="h-12 text-base"
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" size="lg" onClick={() => setShowImageDialog(false)}>
                Cancel
              </Button>
              <Button size="lg" onClick={insertImage} disabled={!imageUrl}>
                Insert
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogEditor; 
