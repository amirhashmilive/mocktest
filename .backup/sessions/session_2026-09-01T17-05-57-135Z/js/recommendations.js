/**
 * MOCKHARD — Smart Recommendations Engine
 * ========================================
 */

const SmartRecommendations = (() => {
  function getRecommendations() {
    const stats = MockStorage.getCategoryStats();
    const categoriesList = typeof CATEGORIES !== 'undefined' ? CATEGORIES : [];
    const weakCategories = MockStorage.getWeakCategories(3);

    const recs = [];

    if (weakCategories.length > 0) {
      weakCategories.forEach(cat => {
        recs.push({
          title: `Focus on ${cat.categoryName}`,
          reason: `Your accuracy is ${cat.accuracy}% in ${cat.categoryName}. Take a Level C or Level B practice test to strengthen core concepts.`,
          actionUrl: `categories.html?category=${cat.category}`,
          actionText: `Practice ${cat.categoryName}`,
          priority: 'high'
        });
      });
    }

    // Default recommendation if fresh user
    if (recs.length === 0) {
      recs.push({
        title: 'Start with Foundation Subjects',
        reason: 'Build a strong baseline across NCERT, Polity, History, and Geography with Foundation Level tests.',
        actionUrl: 'categories.html?category=foundation',
        actionText: 'Explore Foundation Courses',
        priority: 'medium'
      });

      recs.push({
        title: 'Try 15-Question Speed Drills',
        reason: 'Practice auto-level mixed questions in 20-minute timed random tests to boost test-taking speed.',
        actionUrl: 'random.html',
        actionText: 'Launch Random Speed Drill',
        priority: 'medium'
      });
    }

    return recs;
  }

  return {
    getRecommendations
  };
})();
