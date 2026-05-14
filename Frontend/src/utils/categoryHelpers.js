// Поиск категории по slug в дереве
export const findCategoryBySlug = (categories, slug) => {
  for (const category of categories) {
    if (category.slug === slug) return category;
    if (category.children && category.children.length > 0) {
      const found = findCategoryBySlug(category.children, slug);
      if (found) return found;
    }
  }
  return null;
};

// Поиск категории по ID
export const findCategoryById = (categories, id) => {
  for (const category of categories) {
    if (category.id === id) return category;
    if (category.children && category.children.length > 0) {
      const found = findCategoryById(category.children, id);
      if (found) return found;
    }
  }
  return null;
};

// Получение всех категорий определённого уровня
export const getCategoriesByLevel = (categories, level) => {
  let result = [];
  for (const category of categories) {
    if (category.level === level) result.push(category);
    if (category.children && category.children.length > 0) {
      result = [...result, ...getCategoriesByLevel(category.children, level)];
    }
  }
  return result;
};

// Получение breadcrumbs для категории
export const getCategoryBreadcrumbs = (categories, categoryId, breadcrumbs = []) => {
  for (const category of categories) {
    if (category.id === categoryId) {
      return [...breadcrumbs, category];
    }
    if (category.children && category.children.length > 0) {
      const found = getCategoryBreadcrumbs(category.children, categoryId, [...breadcrumbs, category]);
      if (found) return found;
    }
  }
  return null;
};