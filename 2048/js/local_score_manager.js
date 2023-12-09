// local_score_manager.js

function LocalScoreManager() {
  this.key = "bestScore";
}



// LocalScoreManager.prototype.get = async function () {
//   try {
//     const response = await fetch(`http://localhost:3000/bestscore/${this.userId}`);
//     const data = await response.json();
//     return data.success ? data.bestscore : 0;
//   } catch (error) {
//     console.error('Error getting best score:', error);
//     return 0;
//   }
// };

// LocalScoreManager.prototype.set = async function (score) {
//   try {
//     await fetch(`http://localhost:3000/bestscore/${this.userId}`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ bestscore: score }),
//     });
//   } catch (error) {
//     console.error('Error updating best score:', error);
//   }
// };
