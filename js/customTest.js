/**
 * MOCKHARD — Custom Practice Test Builder Module
 * ==============================================
 * Controller script for multi-category custom test creation.
 */

const CustomTestConfig = {
  levels: ['C', 'B', 'A', 'Aplus', 'Aplusplus'],
  questionCounts: [10, 25, 50, 75, 100, 120],
  timeLimits: [15, 30, 45, 60, 90, 120]
};

const CustomTest = (() => {
  function init() {
    console.log('🛠️ Initializing Custom Test Builder Module...');
  }

  function launch(selectedCategories, level, count, time) {
    if (!selectedCategories || selectedCategories.length === 0) {
      if (typeof MockApp !== 'undefined') {
        MockApp.showToast('Please select at least one category to build your custom test!', 'warning', 2500);
      } else {
        alert('Please select at least one category!');
      }
      return;
    }

    if (typeof MockStorage !== 'undefined') {
      MockStorage.clearInProgress();
    }

    const catsQuery = selectedCategories.join(',');
    window.location.href = `test.html?mode=random&cats=${catsQuery}&count=${count}&time=${time}&level=${level}`;
  }

  return { config: CustomTestConfig, init, launch };
})();

if (typeof module !== 'undefined') {
  module.exports = { CustomTestConfig, CustomTest };
}
