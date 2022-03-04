const Recipe = require('../models/Recipe');
const { sesEmail } = require('../utils/sesEmail');

module.exports = class ReviewService {
  static async makeSubmitMessage({ recipeId, userId }) {
    //load recipe using recipe id and user id
    const recipe = await Recipe.getById(recipeId);
    const approvalUrl = `https://noshbook-production.herokuapp.com/api/v1/recipes/approve/${recipeId}`;
    const subject = 'Recipe submitted for NoshBook Council review';
    const messageContent = `NoshBook Council: Please review this recipe (${recipeId}), submitted by user ${userId}:\n
    
    Name: ${recipe.name}\n
    Description: ${recipe.description}\n
    Ingredients: ${recipe.ingredients}\n
    Instructions: ${recipe.instructions}\n
    Tags: ${recipe.tags}\n
    Servings: ${recipe.servings}\n
    Image URL: ${recipe.image}\n
    Time: ${recipe.totalTime}\n

    
    Visit this link to approve: ${approvalUrl}. If it's not good enough for you, ignore this message.`;

    sesEmail(messageContent, subject);
  }

  static async makeApproveConfMessage(id) {
    const subject = `Recipe #${id} approved by the council`;
    const messageContent = 'Approval complete';

    sesEmail(messageContent, subject);
  }
};
