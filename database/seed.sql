-- Seed Data for AI Tools & Prompt Library
-- Sample data for development and demo purposes

INSERT INTO admins (email, password_hash, name, role, is_active) VALUES
('admin@aitoolslib.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin User', 'super_admin', TRUE);
-- Password: password (use bcrypt hashing in production)

INSERT INTO tool_categories (name, slug, description, color, display_order) VALUES
('Writing & Content', 'writing-content', 'AI tools for writing, copywriting, and content creation', '#8B5CF6', 1),
('Image Generation', 'image-generation', 'Tools for creating and editing images with AI', '#EC4899', 2),
('Code & Development', 'code-development', 'Programming, debugging, and development assistance', '#06B6D4', 3),
('Data & Analytics', 'data-analytics', 'Data analysis, visualization, and insights', '#10B981', 4),
('Voice & Audio', 'voice-audio', 'Speech generation, transcription, and audio tools', '#F59E0B', 5),
('Productivity', 'productivity', 'Task automation, scheduling, and workflow tools', '#3B82F6', 6),
('Business & Marketing', 'business-marketing', 'Marketing, sales, and business intelligence tools', '#EF4444', 7),
('Learning & Education', 'learning-education', 'Educational tools and learning assistance', '#06B6D4', 8);

INSERT INTO prompt_categories (name, slug, description, display_order) VALUES
('Content Creation', 'content-creation', 'Prompts for writing blogs, articles, social media', 1),
('Programming', 'programming', 'Code generation and debugging prompts', 2),
('Business', 'business', 'Business analysis and strategy prompts', 3),
('Creative', 'creative', 'Creative writing and brainstorming prompts', 4),
('Learning', 'learning', 'Educational and tutoring prompts', 5),
('Personal Development', 'personal-development', 'Self-improvement and wellness prompts', 6);

INSERT INTO tags (name, slug, usage_count) VALUES
('ChatGPT', 'chatgpt', 15),
('Productivity', 'productivity', 20),
('Design', 'design', 12),
('Writing', 'writing', 18),
('Coding', 'coding', 22),
('Marketing', 'marketing', 14),
('AI', 'ai', 30),
('Automation', 'automation', 16),
('SEO', 'seo', 8),
('Content', 'content', 19),
('Machine Learning', 'machine-learning', 10),
('Analysis', 'analysis', 11),
('Enterprise', 'enterprise', 7),
('Startup', 'startup', 9),
('Free', 'free', 25),
('Open Source', 'open-source', 12),
('Video', 'video', 9),
('Real-time', 'real-time', 7);

-- Sample AI Tools
INSERT INTO tools (name, slug, short_description, description, website_url, category_id, pricing_model, status, is_featured, popularity_score) VALUES
('ChatGPT', 'chatgpt', 'Advanced AI chatbot for conversations and tasks', 'ChatGPT is an AI-powered chatbot developed by OpenAI. It can assist with writing, coding, math, creative tasks, and more. Engage in natural conversations with advanced language understanding.', 'https://chat.openai.com', 1, 'freemium', 'published', TRUE, 100),
('Claude', 'claude', 'Powerful AI assistant by Anthropic', 'Claude is an AI assistant created by Anthropic. It excels at analysis, coding, creative writing, and research. Known for thoughtful responses and strong reasoning capabilities.', 'https://claude.ai', 1, 'freemium', 'published', TRUE, 95),
('Midjourney', 'midjourney', 'Premium AI image generation', 'Midjourney is a leading AI image generation tool. Create stunning, high-quality images from text descriptions. Perfect for artists, designers, and creative professionals.', 'https://midjourney.com', 2, 'paid', 'published', TRUE, 90),
('DALL-E 3', 'dalle-3', 'AI image generation by OpenAI', 'DALL-E 3 generates detailed images from text prompts. Part of ChatGPT Plus, it creates original, artistic images with unprecedented detail and accuracy.', 'https://openai.com/dall-e-3', 2, 'paid', 'published', TRUE, 88),
('GitHub Copilot', 'github-copilot', 'AI-powered code assistant', 'GitHub Copilot uses AI to suggest code snippets and functions. Accelerate development with intelligent code completion powered by machine learning.', 'https://github.com/features/copilot', 3, 'paid', 'published', TRUE, 92),
('Cursor', 'cursor', 'AI-first code editor', 'Cursor is a modern code editor enhanced with AI. Write, refactor, and debug code faster with built-in AI assistance and powerful editing features.', 'https://cursor.com', 3, 'freemium', 'published', FALSE, 70),
('Perplexity AI', 'perplexity-ai', 'AI-powered search engine', 'Perplexity provides AI-powered search with real-time web access. Get accurate, sourced answers with citations for research and information lookup.', 'https://perplexity.ai', 1, 'freemium', 'published', TRUE, 85),
('Jasper', 'jasper', 'AI content generation for marketing', 'Jasper is a content AI for copywriting and marketing. Generate blog posts, ads, emails, and more with brand voice consistency.', 'https://www.jasper.ai', 1, 'paid', 'published', FALSE, 75),
('Runway ML', 'runway-ml', 'Creative suite powered by AI', 'Runway is a creative tool for video and image editing with AI. Edit videos, generate frames, remove objects, and more with AI assistance.', 'https://runwayml.com', 2, 'freemium', 'published', FALSE, 72),
('Eleven Labs', 'eleven-labs', 'AI voice generation and cloning', 'Eleven Labs provides high-quality AI voice synthesis and cloning. Create natural-sounding speech for content, games, and applications.', 'https://elevenlabs.io', 5, 'freemium', 'published', FALSE, 68);

-- Insert tool-category relationships and tags
INSERT INTO tool_tags (tool_id, tag_id) VALUES
(1, 1), (1, 7), (1, 15), -- ChatGPT: ChatGPT, AI, Free
(2, 7), (2, 15), -- Claude: AI, Free
(3, 2), (3, 12), -- Midjourney: Design, Analysis
(4, 2), (4, 7), -- DALL-E: Design, AI
(5, 5), (5, 3), -- Copilot: Coding, Automation
(6, 5), (6, 15), -- Cursor: Coding, Free
(7, 7), (7, 15), -- Perplexity: AI, Free
(8, 4), (8, 6), -- Jasper: Writing, Marketing
(9, 2), (9, 17), -- Runway: Design, Video
(10, 18), (10, 15); -- Eleven Labs: Real-time, Free

-- Sample Prompts
INSERT INTO prompts (title, slug, short_description, content, preview_text, category_id, prompt_type, industry, complexity, status, is_featured) VALUES
('Blog Post Outline Generator', 'blog-post-outline-generator', 'Create structured outlines for blog posts', 'You are an expert content strategist. Create a detailed blog post outline for the topic: [TOPIC]. Include:\n\n1. SEO-optimized title suggestions\n2. Meta description\n3. Main sections with subsections\n4. Key points for each section\n5. Call-to-action suggestions\n\nFormat the outline in markdown with clear hierarchy.', 'You are an expert content strategist...', 1, 'template', 'Content Marketing', 'beginner', 'published', TRUE),
('Python Function Documentation', 'python-function-documentation', 'Generate comprehensive function documentation', 'You are a Python documentation expert. Generate professional documentation for this function:\n\n```python\n[FUNCTION_CODE]\n```\n\nInclude:\n1. Function purpose\n2. Parameters with types\n3. Return value\n4. Raises/Exceptions\n5. Usage examples\n6. Performance notes\n\nFormat as docstring.', 'You are a Python documentation expert...', 2, 'template', 'Software Development', 'intermediate', 'published', FALSE),
('Social Media Caption Creator', 'social-media-caption-creator', 'Create engaging social media captions', 'Write an engaging [PLATFORM] caption for this content: [CONTENT_DESCRIPTION]\n\nRequirements:\n- Hook in first line\n- Clear value proposition\n- Call-to-action\n- Relevant hashtags (5-10)\n- Emoji usage where appropriate\n- Optimal length for platform\n\nProvide 3 variations.', 'Write an engaging social media caption...', 1, 'template', 'Social Media Marketing', 'beginner', 'published', TRUE),
('Product Launch Strategy', 'product-launch-strategy', 'Develop a comprehensive product launch plan', 'I need help creating a product launch strategy for: [PRODUCT_DESCRIPTION]\n\nPlease provide:\n1. Market analysis\n2. Target audience segmentation\n3. Pre-launch activities\n4. Launch day timeline\n5. Post-launch momentum plan\n6. Success metrics\n7. Risk mitigation\n8. Budget allocation framework\n\nConsider competitive landscape and market trends.', 'I need help creating a product launch strategy...', 3, 'template', 'Product Management', 'advanced', 'published', FALSE),
('Debate Structure Builder', 'debate-structure-builder', 'Build well-structured arguments for debates', 'Help me structure an argument for this position: [POSITION]\n\nProvide:\n1. Strong thesis statement\n2. 3-4 main supporting arguments\n3. Evidence for each argument\n4. Counter-arguments and rebuttals\n5. Conclusion reinforcing thesis\n\nMake it logically sound and persuasive.', 'Help me structure an argument...', 4, 'template', 'Education', 'intermediate', 'published', FALSE),
('Learning Path Creator', 'learning-path-creator', 'Create structured learning paths', 'I want to learn [SKILL]. Create a comprehensive learning path:\n\n1. Prerequisites\n2. Core concepts (ordered)\n3. Practical exercises\n4. Resources (books, courses, tutorials)\n5. Projects to build\n6. Assessment criteria\n7. Timeline estimate\n8. Next advanced skills\n\nFormat for self-paced learning.', 'I want to learn...', 5, 'template', 'Education', 'beginner', 'published', TRUE);

-- Insert prompt tags
INSERT INTO prompt_tags (prompt_id, tag_id) VALUES
(1, 3), (1, 4), -- Blog Outline: Writing, Content
(2, 5), (2, 11), -- Python Docs: Coding, ML
(3, 4), (3, 6), -- Social Caption: Content, Marketing
(4, 3), (4, 6), -- Launch Strategy: Writing, Marketing
(5, 9), (5, 7), -- Debate: Analysis, AI
(6, 7), (6, 8); -- Learning Path: AI, Automation

-- Sample Featured Collections
INSERT INTO featured_items (collection_name, collection_slug, entity_type, entity_id, display_order, description) VALUES
('Best Writing Tools', 'best-writing-tools', 'tool', 1, 1, 'Top AI tools for writers and content creators'),
('Best Writing Tools', 'best-writing-tools', 'tool', 2, 2, 'Versatile AI assistant for all writing tasks'),
('Best Image Tools', 'best-image-tools', 'tool', 3, 1, 'Premium image generation with highest quality'),
('Best Image Tools', 'best-image-tools', 'tool', 4, 2, 'OpenAI\'s advanced image generation'),
('Trending Prompts', 'trending-prompts', 'prompt', 1, 1, 'Essential prompt for content marketers'),
('Trending Prompts', 'trending-prompts', 'prompt', 3, 2, 'Must-have for social media managers');

-- Sample Settings
INSERT INTO settings (key_name, value, value_type, description, is_public) VALUES
('app_name', 'AI Tools Library', 'string', 'Application name', TRUE),
('app_tagline', 'Discover and Share AI Tools & Prompts', 'string', 'App tagline for homepage', TRUE),
('items_per_page', '12', 'integer', 'Default pagination size', FALSE),
('enable_user_submissions', 'true', 'boolean', 'Allow users to submit tools', FALSE),
('max_file_upload_size', '5242880', 'integer', 'Max file upload in bytes', FALSE),
('maintenance_mode', 'false', 'boolean', 'Enable maintenance mode', FALSE);
