<?php

namespace App\Controllers;

use App\Models\Category;
use App\Utils\Response;

class CategoryController
{
    private $categoryModel;

    public function __construct()
    {
        $this->categoryModel = new Category();
    }

    public function list()
    {
        $type = $_GET['type'] ?? 'tool';

        if ($type === 'prompt') {
            $categories = $this->categoryModel->getAllPromptCategories();
        } else {
            $categories = $this->categoryModel->getAllToolCategories();
        }

        Response::success($categories, 'Categories retrieved successfully');
    }

    public function show($id, $type = 'tool')
    {
        $id = intval($id);

        if ($type === 'prompt') {
            $category = $this->categoryModel->getPromptCategoryById($id);
        } else {
            $category = $this->categoryModel->getToolCategoryById($id);
        }

        if (!$category) {
            Response::notFound('Category not found');
        }

        Response::success($category, 'Category retrieved successfully');
    }
}
