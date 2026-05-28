// store/slices/debugUtils.js или直接在 productsSlice.js 中添加
export const debugProductFields = (products, brandName) => {
  if (!products || products.length === 0) {
    console.log(`❌ ${brandName}: Нет товаров`);
    return;
  }

  const fieldStats = {};
  
  // Собираем статистику по всем полям
  products.forEach(product => {
    Object.keys(product).forEach(field => {
      if (!fieldStats[field]) {
        fieldStats[field] = {
          total: products.length,
          filled: 0,
          empty: 0,
          examples: []
        };
      }
      
      const value = product[field];
      const isFilled = value !== null && value !== undefined && value !== '';
      
      if (isFilled) {
        fieldStats[field].filled++;
        // Сохраняем примеры значений (до 3х)
        if (fieldStats[field].examples.length < 3) {
          fieldStats[field].examples.push({
            value: typeof value === 'object' ? JSON.stringify(value).substring(0, 100) : String(value).substring(0, 100),
            id: product.id
          });
        }
      } else {
        fieldStats[field].empty++;
      }
    });
  });
  
  // Выводим статистику
  console.log(`\n📊 === ${brandName} (${products.length} товаров) ===`);
  
  // Сортируем поля по заполненности (от большего к меньшему)
  const sortedFields = Object.entries(fieldStats).sort((a, b) => b[1].filled - a[1].filled);
  
  sortedFields.forEach(([field, stats]) => {
    const percent = ((stats.filled / stats.total) * 100).toFixed(1);
    const bar = '█'.repeat(Math.floor(percent / 5)) + '░'.repeat(20 - Math.floor(percent / 5));
    
    console.log(`\n📌 ${field}`);
    console.log(`   ${bar} ${percent}% (${stats.filled}/${stats.total})`);
    
    // Показываем примеры заполненных значений
    if (stats.examples.length > 0 && stats.filled > 0) {
      console.log(`   💡 Примеры:`);
      stats.examples.forEach((ex, idx) => {
        console.log(`      ${idx + 1}. ID:${ex.id} → "${ex.value}"`);
      });
    }
    
    // Показываем предупреждение если поле почти не заполнено
    if (stats.filled === 0) {
      console.log(`   ⚠️  ПОЛЕ ПУСТОЕ У ВСЕХ ТОВАРОВ!`);
    } else if (stats.filled / stats.total < 0.3) {
      console.log(`   ⚠️  Заполнено менее 30%`);
    }
  });
  
  console.log(`\n📈 Итого полей: ${sortedFields.length}\n`);
};

// Функция для сравнения двух брендов
export const compareBrandsFields = (brandsData) => {
  console.log('\n🔍 === СРАВНЕНИЕ СТРУКТУР БРЕНДОВ ===\n');
  
  Object.entries(brandsData).forEach(([brandName, products]) => {
    if (products && products.length > 0) {
      const firstProduct = products[0];
      const fieldCount = Object.keys(firstProduct).length;
      console.log(`${brandName}: ${products.length} товаров, ${fieldCount} полей`);
    } else {
      console.log(`${brandName}: Нет данных`);
    }
  });
};

// Расширенная отладка для конкретного товара
// Расширенная отладка для конкретного товара
export const debugSingleProduct = (product, brandName) => {
  console.log(`\n🔬 === ДЕТАЛЬНЫЙ РАЗБОР: ${brandName} (ID: ${product.id}) ===`);
  
  // Группируем поля по типу
  const grouped = {
    идентификаторы: ['id', 'sku', 'model', 'ean', 'manufacturer_code'],
    название: ['name', 'brandName', 'brand'],
    цена: ['price', 'price_public', 'price_retail', 'promo_price_public'],
    изображения: ['main_image'],
    описание: ['description', 'comment', 'specifications', 'functionality', 'programs'],
    характеристики: ['color', 'width', 'height', 'depth', 'volume', 'net_weight', 'gross_weight', 'width_cm', 'performance_m3h', 'min_noise_db'],
    категории: ['categoryId', 'category_name', 'product_group', 'series', 'line'],
    статус: ['status', 'door_hinge', 'mounting_type', 'control_type'],
    другие: []
  };
  
  // Исправленный цикл
  Object.keys(product).forEach(field => {
    let found = false;
    for (const [groupName, fields] of Object.entries(grouped)) {
      if (fields.includes(field)) {
        found = true;
        break;
      }
    }
    if (!found) {
      grouped.другие.push(field);
    }
  });
  
  for (const [groupName, fields] of Object.entries(grouped)) {
    if (fields.length > 0 && groupName !== 'другие') {
      console.log(`\n📁 ${groupName.toUpperCase()}:`);
      fields.forEach(field => {
        const value = product[field];
        const displayValue = value !== null && value !== undefined && value !== '' 
          ? (typeof value === 'object' ? JSON.stringify(value).substring(0, 100) : String(value).substring(0, 100))
          : '❌ НЕТ ДАННЫХ';
        console.log(`   ${field}: ${displayValue}`);
      });
    }
  }
  
  // Отдельно выводим "другие" поля, если они есть
  if (grouped.другие.length > 0) {
    console.log(`\n📁 ДРУГИЕ ПОЛЯ (не классифицированы):`);
    grouped.другие.forEach(field => {
      const value = product[field];
      const displayValue = value !== null && value !== undefined && value !== '' 
        ? (typeof value === 'object' ? JSON.stringify(value).substring(0, 100) : String(value).substring(0, 100))
        : '❌ НЕТ ДАННЫХ';
      console.log(`   ${field}: ${displayValue}`);
    });
  }
};