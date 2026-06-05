const express = require('express')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { query } = require('./src/db')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 3001
const uploadDir = process.env.UPLOAD_DIR || 'uploads'
const uploadPath = path.join(__dirname, uploadDir)

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadPath),
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')
    cb(null, `${Date.now()}-${safeName}`)
  },
})
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /^image\/(jpeg|png|gif|webp)$/
    if (allowed.test(file.mimetype)) cb(null, true)
    else cb(new Error('Only image files are allowed'))
  },
})
const corsOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:5173', 'http://localhost:5174']
const jwtSecret = process.env.JWT_SECRET || 'supersecret'
const jwtExpiry = process.env.JWT_EXPIRY || '86400'

app.use(cors({ 
  origin: corsOrigins, 
  credentials: true 
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(uploadPath))

const initLearningArticlesTable = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS learning_articles (
      id INT PRIMARY KEY AUTO_INCREMENT,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      excerpt VARCHAR(500),
      content LONGTEXT NOT NULL,
      category VARCHAR(100) DEFAULT 'General',
      difficulty ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
      read_time_minutes INT DEFAULT 10,
      cover_image_url VARCHAR(500),
      status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
      display_order INT DEFAULT 0,
      view_count INT DEFAULT 0,
      created_by INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_slug (slug),
      INDEX idx_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `)
  try {
    await query('ALTER TABLE learning_articles ADD COLUMN view_count INT DEFAULT 0')
  } catch (_) {
    /* column may already exist */
  }
}
const seedLearningArticles = async () => {
  const [{ count }] = await query('SELECT COUNT(*) AS count FROM learning_articles')
  if (count > 0) return

  const samples = [
    {
      title: 'How to Create an AI Agent',
      slug: 'ai-agent',
      excerpt: 'Build your own AI agent from scratch using modern frameworks.',
      category: 'AI Agents',
      difficulty: 'intermediate',
      read_time_minutes: 15,
      display_order: 1,
      content: `## Introduction\n\nAI agents are autonomous systems that perceive, decide, and act toward goals.\n\n## What You'll Learn\n\n- Core concepts of AI agents\n- Architecture patterns\n- Practical implementation tips\n\n\`\`\`javascript\nconst agent = { perceive, decide, act };\nconsole.log('Agent ready');\n\`\`\`\n\n## Next steps\n\nExperiment with a simple loop and add tools incrementally.`,
    },
    {
      title: 'How to Configure an MCP Server',
      slug: 'mcp-server',
      excerpt: 'Set up a Model Context Protocol server for your apps.',
      category: 'Integration',
      difficulty: 'advanced',
      read_time_minutes: 20,
      display_order: 2,
      content: `## Overview\n\nMCP connects models to external tools and data sources.\n\n## Setup\n\n1. Install the SDK\n2. Define resources and tools\n3. Register with your client\n\n\`\`\`json\n{ "name": "my-server", "version": "1.0.0" }\n\`\`\``,
    },
    {
      title: 'Getting Started with LLMs',
      slug: 'llm-basics',
      excerpt: 'Introduction to Large Language Models.',
      category: 'Fundamentals',
      difficulty: 'beginner',
      read_time_minutes: 12,
      display_order: 3,
      content: `## What is an LLM?\n\nLarge Language Models predict text from context — powering chat, code, and search.\n\n## Key concepts\n\n- Tokens and context windows\n- Temperature and sampling\n- System vs user messages`,
    },
    {
      title: 'Prompt Engineering Best Practices',
      slug: 'prompt-engineering',
      excerpt: 'Write clearer prompts for better model outputs.',
      category: 'Prompting',
      difficulty: 'intermediate',
      read_time_minutes: 14,
      display_order: 4,
      content: `## Principles\n\n- Be specific about format and tone\n- Provide examples (few-shot)\n- Iterate and evaluate\n\n\`\`\`\nRole: expert editor\nTask: improve clarity\nOutput: bullet list of changes\n\`\`\``,
    },
    {
      title: 'Integrating AI with Your Web App',
      slug: 'web-integration',
      excerpt: 'Add AI features to React and Node apps safely.',
      category: 'Web Integration',
      difficulty: 'intermediate',
      read_time_minutes: 18,
      display_order: 5,
      content: `## Architecture\n\nKeep API keys on the server. Stream responses to the UI when possible.\n\n## Stack tips\n\n- Use environment variables\n- Rate-limit public endpoints\n- Log prompts without PII`,
    },
    {
      title: 'Fine-tuning Language Models',
      slug: 'fine-tuning',
      excerpt: 'Customize models for domain-specific tasks.',
      category: 'Advanced AI',
      difficulty: 'advanced',
      read_time_minutes: 22,
      display_order: 6,
      content: `## When to fine-tune\n\nPrefer prompting first. Fine-tune when you need consistent style or domain vocabulary.\n\n## Workflow\n\n1. Curate quality examples\n2. Train and evaluate\n3. Deploy behind a feature flag`,
    },
  ]

  for (const a of samples) {
    await query(
      `INSERT INTO learning_articles (title, slug, excerpt, content, category, difficulty, read_time_minutes, status, display_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'published', ?)`,
      [a.title, a.slug, a.excerpt, a.content, a.category, a.difficulty, a.read_time_minutes, a.display_order]
    )
  }
  console.log('Seeded learning articles')
}

initLearningArticlesTable()
  .then(() => seedLearningArticles())
  .catch((err) => console.error('learning_articles init:', err.message))

const sendError = (res, status, message) => res.status(status).json({ error: message })

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (!token) {
    return sendError(res, 401, 'Authorization token is required')
  }

  try {
    const decoded = jwt.verify(token, jwtSecret)
    const rows = await query('SELECT id, email, name, role, is_active FROM admins WHERE id = ? LIMIT 1', [decoded.id])
    if (!rows.length || !rows[0].is_active) {
      return sendError(res, 401, 'Invalid admin session')
    }
    req.admin = rows[0]
    next()
  } catch (error) {
    return sendError(res, 401, 'Invalid or expired token')
  }
}

const parseIntOrDefault = (value, fallback) => {
  const parsed = parseInt(value, 10)
  return Number.isNaN(parsed) ? fallback : parsed
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0' })
})

app.get('/api/tools', async (req, res) => {
  const page = parseIntOrDefault(req.query.page, 1)
  const limit = parseIntOrDefault(req.query.perPage || req.query.limit, 12)
  const offset = (page - 1) * limit
  const searchQuery = req.query.search || req.query.q
  const search = searchQuery ? `%${searchQuery}%` : null
  const categoryId = req.query.category_id || req.query.category ? Number(req.query.category_id || req.query.category) : null
  const pricingModel = req.query.pricing_model || req.query.pricing
  const sortBy = req.query.sortBy || 'popularity_score'
  const sortOrder = (req.query.sortOrder || 'desc').toUpperCase()

  try {
    const filters = ['t.status = "published"']
    const params = []

    if (search) {
      filters.push('(t.name LIKE ? OR t.description LIKE ? OR t.short_description LIKE ?)')
      params.push(search, search, search)
    }
    if (categoryId) {
      filters.push('t.category_id = ?')
      params.push(categoryId)
    }
    if (pricingModel) {
      filters.push('t.pricing_model = ?')
      params.push(pricingModel)
    }

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : ''
    
    // Build ORDER BY clause based on sortBy parameter
    let orderClause = 't.is_featured DESC'
    switch (sortBy) {
      case 'name':
        orderClause += `, t.name ${sortOrder}`
        break
      case 'created_at':
        orderClause += `, t.created_at ${sortOrder}`
        break
      case 'view_count':
        orderClause += `, t.view_count ${sortOrder}`
        break
      case 'popularity_score':
      default:
        orderClause += `, t.popularity_score ${sortOrder}, t.created_at DESC`
    }

    const tools = await query(`
      SELECT t.*, c.name AS category_name, c.slug AS category_slug
      FROM tools t
      LEFT JOIN tool_categories c ON t.category_id = c.id
      ${whereClause}
      ORDER BY ${orderClause}
      LIMIT ? OFFSET ?
    `, [...params, limit, offset])

    const total = await query(`SELECT COUNT(*) AS count FROM tools t ${whereClause}`, params)
    res.json({ data: tools, meta: { page, limit, total: total[0]?.count ?? 0 } })
  } catch (error) {
    console.error(error)
    sendError(res, 500, 'Unable to load tools')
  }
})

app.get('/api/tools/:id', async (req, res) => {
  const id = Number(req.params.id)
  if (!id) {
    return sendError(res, 400, 'Invalid tool ID')
  }

  try {
    const rows = await query(
      `SELECT t.*, c.name AS category_name, c.slug AS category_slug
       FROM tools t
       LEFT JOIN tool_categories c ON t.category_id = c.id
       WHERE t.id = ? LIMIT 1`,
      [id]
    )
    if (!rows.length) {
      return sendError(res, 404, 'Tool not found')
    }
    res.json({ data: rows[0] })
  } catch (error) {
    console.error(error)
    sendError(res, 500, 'Unable to load tool')
  }
})

app.post('/api/tools/:id/view', async (req, res) => {
  const id = Number(req.params.id)
  if (!id) return sendError(res, 400, 'Invalid tool ID')
  try {
    await query('UPDATE tools SET view_count = view_count + 1 WHERE id = ? AND status = "published"', [id])
    const rows = await query('SELECT view_count FROM tools WHERE id = ? LIMIT 1', [id])
    if (!rows.length) return sendError(res, 404, 'Tool not found')
    res.json({ success: true, view_count: rows[0].view_count })
  } catch (error) {
    console.error(error)
    sendError(res, 500, 'Unable to record view')
  }
})

app.get('/api/tools/search', async (req, res) => {
  req.query.page = req.query.page || 1
  req.query.limit = req.query.limit || 12
  const search = req.query.q ? `%${req.query.q}%` : null
  const page = parseIntOrDefault(req.query.page, 1)
  const limit = parseIntOrDefault(req.query.limit, 12)
  const offset = (page - 1) * limit

  try {
    const filters = ['t.status = "published"']
    const params = []

    if (search) {
      filters.push('(t.name LIKE ? OR t.description LIKE ? OR t.short_description LIKE ?)')
      params.push(search, search, search)
    }

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : ''
    const tools = await query(`
      SELECT t.*, c.name AS category_name, c.slug AS category_slug
      FROM tools t
      LEFT JOIN tool_categories c ON t.category_id = c.id
      ${whereClause}
      ORDER BY t.is_featured DESC, t.popularity_score DESC, t.created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, limit, offset])

    const total = await query(`SELECT COUNT(*) AS count FROM tools t ${whereClause}`, params)
    res.json({ data: tools, meta: { page, limit, total: total[0]?.count ?? 0 } })
  } catch (error) {
    console.error(error)
    sendError(res, 500, 'Unable to search tools')
  }
})

app.get('/api/prompts', async (req, res) => {
  const page = parseIntOrDefault(req.query.page, 1)
  const limit = parseIntOrDefault(req.query.perPage || req.query.limit, 12)
  const offset = (page - 1) * limit
  const searchQuery = req.query.search || req.query.q
  const search = searchQuery ? `%${searchQuery}%` : null
  const categoryId = req.query.category_id || req.query.category ? Number(req.query.category_id || req.query.category) : null
  const complexity = req.query.complexity
  const sortBy = req.query.sortBy || 'created_at'
  const sortOrder = (req.query.sortOrder || 'desc').toUpperCase()

  try {
    const filters = ['p.status = "published"']
    const params = []

    if (search) {
      filters.push('(p.title LIKE ? OR p.content LIKE ? OR p.short_description LIKE ?)')
      params.push(search, search, search)
    }
    if (categoryId) {
      filters.push('p.category_id = ?')
      params.push(categoryId)
    }
    if (complexity) {
      filters.push('p.complexity = ?')
      params.push(complexity)
    }

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : ''
    
    // Build ORDER BY clause based on sortBy parameter
    let orderClause = 'p.is_featured DESC'
    switch (sortBy) {
      case 'title':
        orderClause += `, p.title ${sortOrder}`
        break
      case 'created_at':
        orderClause += `, p.created_at ${sortOrder}`
        break
      case 'copy_count':
        orderClause += `, p.copy_count ${sortOrder}`
        break
      default:
        orderClause += `, p.copy_count ${sortOrder}, p.created_at DESC`
    }

    const prompts = await query(`
      SELECT p.*, c.name AS category_name, c.slug AS category_slug
      FROM prompts p
      LEFT JOIN prompt_categories c ON p.category_id = c.id
      ${whereClause}
      ORDER BY ${orderClause}
      LIMIT ? OFFSET ?
    `, [...params, limit, offset])

    const total = await query(`SELECT COUNT(*) AS count FROM prompts p ${whereClause}`, params)
    res.json({ data: prompts, meta: { page, limit, total: total[0]?.count ?? 0 } })
  } catch (error) {
    console.error(error)
    sendError(res, 500, 'Unable to load prompts')
  }
})

app.get('/api/prompts/:id', async (req, res) => {
  const id = Number(req.params.id)
  if (!id) {
    return sendError(res, 400, 'Invalid prompt ID')
  }

  try {
    const rows = await query(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug
       FROM prompts p
       LEFT JOIN prompt_categories c ON p.category_id = c.id
       WHERE p.id = ? LIMIT 1`,
      [id]
    )
    if (!rows.length) {
      return sendError(res, 404, 'Prompt not found')
    }
    res.json(rows[0])
  } catch (error) {
    console.error(error)
    sendError(res, 500, 'Unable to load prompt')
  }
})

app.get('/api/prompts/search', async (req, res) => {
  const search = req.query.q ? `%${req.query.q}%` : null
  const page = parseIntOrDefault(req.query.page, 1)
  const limit = parseIntOrDefault(req.query.limit, 12)
  const offset = (page - 1) * limit

  try {
    const filters = ['p.status = "published"']
    const params = []

    if (search) {
      filters.push('(p.title LIKE ? OR p.content LIKE ? OR p.short_description LIKE ?)')
      params.push(search, search, search)
    }

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : ''
    const prompts = await query(`
      SELECT p.*, c.name AS category_name, c.slug AS category_slug
      FROM prompts p
      LEFT JOIN prompt_categories c ON p.category_id = c.id
      ${whereClause}
      ORDER BY p.is_featured DESC, p.copy_count DESC, p.created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, limit, offset])

    const total = await query(`SELECT COUNT(*) AS count FROM prompts p ${whereClause}`, params)
    res.json({ data: prompts, meta: { page, limit, total: total[0]?.count ?? 0 } })
  } catch (error) {
    console.error(error)
    sendError(res, 500, 'Unable to search prompts')
  }
})

app.post('/api/prompts/:id/copy', async (req, res) => {
  const id = Number(req.params.id)
  if (!id) {
    return sendError(res, 400, 'Invalid prompt ID')
  }

  try {
    const result = await query('UPDATE prompts SET copy_count = copy_count + 1 WHERE id = ? AND status = "published"', [id])
    if (!result.affectedRows) {
      return sendError(res, 404, 'Prompt not found')
    }
    const rows = await query('SELECT copy_count FROM prompts WHERE id = ? LIMIT 1', [id])
    res.json({ success: true, copy_count: rows[0]?.copy_count ?? 0 })
  } catch (error) {
    console.error(error)
    sendError(res, 500, 'Unable to update prompt copy count')
  }
})

app.get('/api/categories', async (req, res) => {
  const type = req.query.type === 'prompt' ? 'prompt' : 'tool'
  const table = type === 'prompt' ? 'prompt_categories' : 'tool_categories'

  try {
    const rows = await query(`SELECT * FROM ${table} WHERE is_active = 1 ORDER BY display_order ASC, name ASC`)
    res.json({ data: rows })
  } catch (error) {
    console.error(error)
    sendError(res, 500, 'Unable to load categories')
  }
})

app.get('/api/categories/:id', async (req, res) => {
  const type = req.query.type === 'prompt' ? 'prompt' : 'tool'
  const table = type === 'prompt' ? 'prompt_categories' : 'tool_categories'
  const id = Number(req.params.id)
  if (!id) {
    return sendError(res, 400, 'Invalid category ID')
  }

  try {
    const rows = await query(`SELECT * FROM ${table} WHERE id = ? LIMIT 1`, [id])
    if (!rows.length) {
      return sendError(res, 404, 'Category not found')
    }
    res.json({ data: rows[0] })
  } catch (error) {
    console.error(error)
    sendError(res, 500, 'Unable to load category')
  }
})

app.get('/api/articles', async (req, res) => {
  try {
    const rows = await query(
      `SELECT id, title, slug, excerpt, category, difficulty, read_time_minutes, view_count, cover_image_url, status, display_order, created_at, updated_at
       FROM learning_articles
       WHERE status = 'published'
       ORDER BY display_order ASC, updated_at DESC`
    )
    res.json({ data: rows })
  } catch (error) {
    console.error(error)
    sendError(res, 500, 'Unable to load articles')
  }
})

app.get('/api/articles/:slug', async (req, res) => {
  try {
    const rows = await query(
      `SELECT * FROM learning_articles WHERE slug = ? AND status = 'published' LIMIT 1`,
      [req.params.slug]
    )
    if (!rows.length) return sendError(res, 404, 'Article not found')
    res.json({ data: rows[0] })
  } catch (error) {
    console.error(error)
    sendError(res, 500, 'Unable to load article')
  }
})

app.post('/api/articles/:slug/view', async (req, res) => {
  const { slug } = req.params
  if (!slug) return sendError(res, 400, 'Invalid article slug')
  try {
    await query('UPDATE learning_articles SET view_count = view_count + 1 WHERE slug = ? AND status = "published"', [slug])
    const rows = await query('SELECT view_count FROM learning_articles WHERE slug = ? LIMIT 1', [slug])
    if (!rows.length) return sendError(res, 404, 'Article not found')
    res.json({ success: true, view_count: rows[0].view_count })
  } catch (error) {
    console.error(error)
    sendError(res, 500, 'Unable to record view')
  }
})

app.get('/api/tags', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM tags ORDER BY usage_count DESC, name ASC')
    res.json(rows)
  } catch (error) {
    console.error(error)
    sendError(res, 500, 'Unable to load tags')
  }
})

app.get('/api/tags/popular', async (req, res) => {
  const limit = parseIntOrDefault(req.query.limit, 20)
  try {
    const rows = await query('SELECT * FROM tags ORDER BY usage_count DESC LIMIT ?', [limit])
    res.json(rows)
  } catch (error) {
    console.error(error)
    sendError(res, 500, 'Unable to load popular tags')
  }
})

app.get('/api/featured', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM featured_items WHERE is_active = 1 ORDER BY display_order ASC')
    res.json(rows)
  } catch (error) {
    console.error(error)
    sendError(res, 500, 'Unable to load featured items')
  }
})

app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return sendError(res, 400, 'Email and password are required')
  }

  try {
    const rows = await query('SELECT id, email, password_hash, name, role, is_active FROM admins WHERE email = ? LIMIT 1', [email])
    if (!rows.length || !rows[0].is_active) {
      return sendError(res, 401, 'Invalid email or password')
    }

    const admin = rows[0]
    const valid = await bcrypt.compare(password, admin.password_hash)
    if (!valid) {
      return sendError(res, 401, 'Invalid email or password')
    }

    const token = jwt.sign({ id: admin.id, email: admin.email, role: admin.role }, jwtSecret, {
      expiresIn: `${jwtExpiry}s`,
    })

    res.json({ 
      data: {
        token, 
        admin: { id: admin.id, email: admin.email, name: admin.name, role: admin.role }
      }
    })
  } catch (error) {
    console.error(error)
    sendError(res, 500, 'Unable to complete login')
  }
})

app.post('/api/admin/logout', authMiddleware, async (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' })
})

app.get('/api/admin/me', authMiddleware, async (req, res) => {
  res.json({ admin: req.admin })
})

app.get('/api/admin/dashboard', authMiddleware, async (req, res) => {
  try {
    const [toolCount] = await query('SELECT COUNT(*) AS count FROM tools WHERE status != "archived"')
    const [publishedTools] = await query('SELECT COUNT(*) AS count FROM tools WHERE status = "published"')
    const [promptCount] = await query('SELECT COUNT(*) AS count FROM prompts WHERE status != "archived"')
    const [publishedPrompts] = await query('SELECT COUNT(*) AS count FROM prompts WHERE status = "published"')
    const [featuredTools] = await query('SELECT COUNT(*) AS count FROM tools WHERE is_featured = 1 AND status = "published"')
    const [featuredPrompts] = await query('SELECT COUNT(*) AS count FROM prompts WHERE is_featured = 1 AND status = "published"')
    const [toolViews] = await query('SELECT COALESCE(SUM(view_count), 0) AS total FROM tools')
    const [promptCopies] = await query('SELECT COALESCE(SUM(copy_count), 0) AS total FROM prompts')

    const recentTools = await query(
      `SELECT t.id, t.name, t.status, t.updated_at, 'tool' AS item_type
       FROM tools t
       ORDER BY t.updated_at DESC
       LIMIT 5`
    )
    const recentPrompts = await query(
      `SELECT p.id, p.title AS name, p.status, p.updated_at, 'prompt' AS item_type
       FROM prompts p
       ORDER BY p.updated_at DESC
       LIMIT 5`
    )

    const recentActivity = [...recentTools, ...recentPrompts]
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, 8)
      .map((row) => ({
        id: row.id,
        item_type: row.item_type,
        name: row.name,
        status: row.status,
        updated_at: row.updated_at,
      }))

    res.json({
      stats: {
        tools: toolCount?.count || 0,
        prompts: promptCount?.count || 0,
        published_tools: publishedTools?.count || 0,
        published_prompts: publishedPrompts?.count || 0,
        featured: (featuredTools?.count || 0) + (featuredPrompts?.count || 0),
        total_views: toolViews?.total || 0,
        total_copies: promptCopies?.total || 0,
      },
      recent_activity: recentActivity,
    })
  } catch (error) {
    console.error(error)
    sendError(res, 500, 'Unable to load dashboard data')
  }
})

app.get('/api/admin/tools', authMiddleware, async (req, res) => {
  const searchQuery = req.query.search || req.query.q
  const search = searchQuery ? `%${searchQuery}%` : null
  const status = req.query.status

  try {
    const filters = ['1=1']
    const params = []

    if (status && status !== 'all') {
      filters.push('t.status = ?')
      params.push(status)
    }
    if (search) {
      filters.push('(t.name LIKE ? OR t.short_description LIKE ? OR t.description LIKE ?)')
      params.push(search, search, search)
    }

    const whereClause = `WHERE ${filters.join(' AND ')}`
    const tools = await query(
      `SELECT t.id, t.name, t.slug, t.logo_url, t.status, t.view_count, t.is_featured, t.pricing_model,
              t.created_at, t.updated_at, c.name AS category_name
       FROM tools t
       LEFT JOIN tool_categories c ON t.category_id = c.id
       ${whereClause}
       ORDER BY t.updated_at DESC`,
      params
    )

    res.json({ data: tools })
  } catch (error) {
    console.error(error)
    sendError(res, 500, 'Unable to load admin tools')
  }
})

app.get('/api/admin/prompts', authMiddleware, async (req, res) => {
  const searchQuery = req.query.search || req.query.q
  const search = searchQuery ? `%${searchQuery}%` : null
  const status = req.query.status

  try {
    const filters = ['1=1']
    const params = []

    if (status && status !== 'all') {
      filters.push('p.status = ?')
      params.push(status)
    }
    if (search) {
      filters.push('(p.title LIKE ? OR p.content LIKE ? OR p.short_description LIKE ?)')
      params.push(search, search, search)
    }

    const whereClause = `WHERE ${filters.join(' AND ')}`
    const prompts = await query(
      `SELECT p.id, p.title, p.slug, p.status, p.copy_count, p.view_count, p.is_featured,
              p.created_at, p.updated_at, c.name AS category_name
       FROM prompts p
       LEFT JOIN prompt_categories c ON p.category_id = c.id
       ${whereClause}
       ORDER BY p.updated_at DESC`,
      params
    )

    res.json({ data: prompts })
  } catch (error) {
    console.error(error)
    sendError(res, 500, 'Unable to load admin prompts')
  }
})

app.post('/api/admin/tools', authMiddleware, async (req, res) => {
  const { name, slug, short_description, description, website_url, logo_url, category_id, pricing_model, status, is_featured } = req.body
  if (!name || !slug || !website_url || !category_id) {
    return sendError(res, 400, 'Required tool fields are missing')
  }

  try {
    const result = await query(
      'INSERT INTO tools (name, slug, short_description, description, logo_url, website_url, category_id, pricing_model, status, is_featured, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        name,
        slug,
        short_description || '',
        description || '',
        logo_url || null,
        website_url,
        category_id,
        pricing_model || 'free',
        status || 'draft',
        is_featured ? 1 : 0,
        req.admin.id,
      ]
    )
    res.status(201).json({ id: result.insertId, success: true })
  } catch (error) {
    console.error(error)
    sendError(res, 500, 'Unable to create tool')
  }
})

app.put('/api/admin/tools/:id', authMiddleware, async (req, res) => {
  const id = Number(req.params.id)
  if (!id) {
    return sendError(res, 400, 'Invalid tool ID')
  }

  const fields = []
  const params = []
  const allowed = ['name', 'slug', 'short_description', 'description', 'logo_url', 'website_url', 'category_id', 'pricing_model', 'status', 'is_featured']

  allowed.forEach((key) => {
    if (req.body[key] !== undefined) {
      fields.push(`${key} = ?`)
      params.push(req.body[key])
    }
  })

  if (!fields.length) {
    return sendError(res, 400, 'No valid fields provided to update')
  }

  params.push(id)
  try {
    const result = await query(`UPDATE tools SET ${fields.join(', ')} WHERE id = ?`, params)
    if (!result.affectedRows) {
      return sendError(res, 404, 'Tool not found')
    }
    res.json({ success: true })
  } catch (error) {
    console.error(error)
    sendError(res, 500, 'Unable to update tool')
  }
})

app.delete('/api/admin/tools/:id', authMiddleware, async (req, res) => {
  const id = Number(req.params.id)
  if (!id) {
    return sendError(res, 400, 'Invalid tool ID')
  }

  try {
    const result = await query('UPDATE tools SET status = "archived" WHERE id = ?', [id])
    if (!result.affectedRows) {
      return sendError(res, 404, 'Tool not found')
    }
    res.json({ success: true })
  } catch (error) {
    console.error(error)
    sendError(res, 500, 'Unable to delete tool')
  }
})

app.post('/api/admin/tools/:id/restore', authMiddleware, async (req, res) => {
  const id = Number(req.params.id)
  if (!id) {
    return sendError(res, 400, 'Invalid tool ID')
  }

  try {
    const result = await query('UPDATE tools SET status = "published" WHERE id = ?', [id])
    if (!result.affectedRows) {
      return sendError(res, 404, 'Tool not found')
    }
    res.json({ success: true })
  } catch (error) {
    console.error(error)
    sendError(res, 500, 'Unable to restore tool')
  }
})

app.post('/api/admin/prompts', authMiddleware, async (req, res) => {
  const { title, slug, content, category_id, status, short_description, prompt_type, complexity, is_featured } = req.body
  if (!title || !slug || !content || !category_id) {
    return sendError(res, 400, 'Required prompt fields are missing')
  }

  try {
    const result = await query(
      `INSERT INTO prompts (title, slug, short_description, content, category_id, prompt_type, complexity, status, is_featured, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        slug,
        short_description || '',
        content,
        category_id,
        prompt_type || 'template',
        complexity || 'intermediate',
        status || 'draft',
        is_featured ? 1 : 0,
        req.admin.id,
      ]
    )
    res.status(201).json({ id: result.insertId, success: true })
  } catch (error) {
    console.error(error)
    sendError(res, 500, 'Unable to create prompt')
  }
})

app.put('/api/admin/prompts/:id', authMiddleware, async (req, res) => {
  const id = Number(req.params.id)
  if (!id) {
    return sendError(res, 400, 'Invalid prompt ID')
  }

  const fields = []
  const params = []
  const allowed = ['title', 'slug', 'short_description', 'content', 'prompt_type', 'industry', 'complexity', 'status', 'is_featured']

  allowed.forEach((key) => {
    if (req.body[key] !== undefined) {
      fields.push(`${key} = ?`)
      params.push(req.body[key])
    }
  })

  if (!fields.length) {
    return sendError(res, 400, 'No valid fields provided to update')
  }

  params.push(id)
  try {
    const result = await query(`UPDATE prompts SET ${fields.join(', ')} WHERE id = ?`, params)
    if (!result.affectedRows) {
      return sendError(res, 404, 'Prompt not found')
    }
    res.json({ success: true })
  } catch (error) {
    console.error(error)
    sendError(res, 500, 'Unable to update prompt')
  }
})

app.delete('/api/admin/prompts/:id', authMiddleware, async (req, res) => {
  const id = Number(req.params.id)
  if (!id) {
    return sendError(res, 400, 'Invalid prompt ID')
  }

  try {
    const result = await query('UPDATE prompts SET status = "archived" WHERE id = ?', [id])
    if (!result.affectedRows) {
      return sendError(res, 404, 'Prompt not found')
    }
    res.json({ success: true })
  } catch (error) {
    console.error(error)
    sendError(res, 500, 'Unable to delete prompt')
  }
})

app.post('/api/admin/upload', authMiddleware, (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) return sendError(res, 400, err.message || 'Upload failed')
    if (!req.file) return sendError(res, 400, 'No file uploaded')
    const url = `/uploads/${req.file.filename}`
    res.json({ data: { url, filename: req.file.filename } })
  })
})

app.get('/api/admin/articles', authMiddleware, async (req, res) => {
  const search = req.query.search ? `%${req.query.search}%` : null
  const status = req.query.status
  try {
    const filters = ['1=1']
    const params = []
    if (status && status !== 'all') {
      filters.push('status = ?')
      params.push(status)
    }
    if (search) {
      filters.push('(title LIKE ? OR excerpt LIKE ? OR content LIKE ?)')
      params.push(search, search, search)
    }
    const rows = await query(
      `SELECT id, title, slug, excerpt, category, difficulty, read_time_minutes, view_count, cover_image_url, status, display_order, updated_at
       FROM learning_articles WHERE ${filters.join(' AND ')} ORDER BY display_order ASC, updated_at DESC`,
      params
    )
    res.json({ data: rows })
  } catch (error) {
    console.error(error)
    sendError(res, 500, 'Unable to load articles')
  }
})

app.get('/api/admin/articles/:id', authMiddleware, async (req, res) => {
  const id = Number(req.params.id)
  if (!id) return sendError(res, 400, 'Invalid article ID')
  try {
    const rows = await query('SELECT * FROM learning_articles WHERE id = ? LIMIT 1', [id])
    if (!rows.length) return sendError(res, 404, 'Article not found')
    res.json({ data: rows[0] })
  } catch (error) {
    console.error(error)
    sendError(res, 500, 'Unable to load article')
  }
})

app.post('/api/admin/articles', authMiddleware, async (req, res) => {
  const { title, slug, excerpt, content, category, difficulty, read_time_minutes, cover_image_url, status, display_order } = req.body
  if (!title || !slug || !content) return sendError(res, 400, 'Title, slug, and content are required')
  try {
    const result = await query(
      `INSERT INTO learning_articles (title, slug, excerpt, content, category, difficulty, read_time_minutes, cover_image_url, status, display_order, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        slug,
        excerpt || '',
        content,
        category || 'General',
        difficulty || 'beginner',
        read_time_minutes || 10,
        cover_image_url || null,
        status || 'draft',
        display_order || 0,
        req.admin.id,
      ]
    )
    res.status(201).json({ id: result.insertId, success: true })
  } catch (error) {
    console.error(error)
    sendError(res, 500, 'Unable to create article')
  }
})

app.put('/api/admin/articles/:id', authMiddleware, async (req, res) => {
  const id = Number(req.params.id)
  if (!id) return sendError(res, 400, 'Invalid article ID')
  const allowed = ['title', 'slug', 'excerpt', 'content', 'category', 'difficulty', 'read_time_minutes', 'cover_image_url', 'status', 'display_order']
  const fields = []
  const params = []
  allowed.forEach((key) => {
    if (req.body[key] !== undefined) {
      fields.push(`${key} = ?`)
      params.push(req.body[key])
    }
  })
  if (!fields.length) return sendError(res, 400, 'No valid fields provided')
  params.push(id)
  try {
    const result = await query(`UPDATE learning_articles SET ${fields.join(', ')} WHERE id = ?`, params)
    if (!result.affectedRows) return sendError(res, 404, 'Article not found')
    res.json({ success: true })
  } catch (error) {
    console.error(error)
    sendError(res, 500, 'Unable to update article')
  }
})

app.delete('/api/admin/articles/:id', authMiddleware, async (req, res) => {
  const id = Number(req.params.id)
  if (!id) return sendError(res, 400, 'Invalid article ID')
  try {
    const result = await query('UPDATE learning_articles SET status = "archived" WHERE id = ?', [id])
    if (!result.affectedRows) return sendError(res, 404, 'Article not found')
    res.json({ success: true })
  } catch (error) {
    console.error(error)
    sendError(res, 500, 'Unable to archive article')
  }
})

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

app.listen(port, () => {
  console.log(`Backend Node server listening on http://localhost:${port}`)
})
