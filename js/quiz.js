export class Quiz {
  constructor(category, difficulty, amount) {
    this.category   = category;    
    this.difficulty = difficulty;  
    this.amount     = amount;      
    this.score      = 0;
  }

  async getQuizQuestions() {
    const params = new URLSearchParams({
      amount: String(this.amount),
      difficulty: this.difficulty || 'easy'
    });

    
    if (this.category) params.set('category', this.category);

    const url = `https://opentdb.com/api.php?${params.toString()}`;
    const response = await fetch(url);
    const data = await response.json();

    
    return Array.isArray(data.results) ? data.results : [];
  }
}
