const filePath = 'user.json';
var gameManagerInstance;
var loggedInUserId = null;

function btnstart(){
  console.log(1);
  document.getElementById("log-sign").style.backgroundImage="linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),url(./style/Login_SC.jpg)";
  document.getElementById("login-container").style.display="block";
}

function rankrestart(){
  document.getElementsByClassName("RankingBG")[0].style.display="none";
  document.getElementsByClassName("container")[0].style.display="block";
}

function goRank(){
  document.getElementsByClassName("RankingBG")[0].style.display="block";
  document.getElementsByClassName("container")[0].style.display="none";
}

function signupRequest() {
  var newUsername = document.getElementById("signup-username").value;
  var newPassword = document.getElementById("signup-password").value;

  // AJAX를 사용하여 서버에 회원가입 요청
  fetch('http://localhost:3000/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username: newUsername, password: newPassword, bestscore: 0 }),
  })
    .then(response => {
      if (!response.ok) {
        // HTTP 상태 코드가 오류인 경우
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      // 서버 응답 처리
      alert(data.message);
      if (data.success) {
        // 회원가입이 성공했을 경우
        document.getElementById("login-container").style.display = "block";
        document.getElementById("signup-container").style.display = "none";
      }
    })
    .catch(error => {
      //console.error('Error during signup request:', error.message);
      alert('Username already exists');
    });
}


  function backtologin(){
    document.getElementById("login-container").style.display = "block";
    document.getElementById("signup-container").style.display = "none";
  }


//로그인 화면 숨기기 
function showSignup() {
  document.getElementById("login-container").style.display = "none";
  document.getElementById("signup-container").style.display = "block";
}



// 로그인 요청
function loginRequest() {
  var username = document.getElementById("login-username").value;
  var password = document.getElementById("login-password").value;

  fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password: password.toString() }),

  })
  .then(response => {
    //console.log('Server response:', response);
    return response.json();
  })
    .then(data => {
      if (data.success) {
        alert(data.message);
        console.log('200, Login successful!')
        document.getElementById("log-sign").style.display="none";
        // 사용자 아이디 저장
        loggedInUserId = data.userId;
        // 최고 점수 가져오기
        fetch(`http://localhost:3000/bestscore/${loggedInUserId}`)
          .then(response => response.json())
          .then(scoreData => {
            if (scoreData.success) {
              onLoginSuccess(scoreData.bestscore);
            } else {
              alert(`Failed to get best score: ${scoreData.error}`);
            }
          })
          .catch(error => {
            console.error('Error getting best score:', error);
            alert('Failed to get best score. Please try again.');
          });
      } else {
        alert(`Login failed: ${data.error}`);
      }
    })
    .catch(error => {
      console.error('Error during login request:', error);
      alert('Failed to log in. Please try again.');
    });
}

function onLoginSuccess(bestscore) {
  document.getElementById("login-container").style.display = "none";
  document.getElementById("signup-container").style.display = "none";
  document.getElementsByClassName("container")[0].style.display="block";
  document.getElementsByClassName("game-container")[0].style.display="block";
  const userId = loggedInUserId;
  gameManagerInstance = new GameManager(5, KeyboardInputManager, HTMLActuator, LocalScoreManager,bestscore); 
}

document.addEventListener("click", function(event) {
  var cell = getCellFromEvent(event); // 이 함수는 이벤트로부터 셀의 위치를 얻어야 합니다.
  if (cell) {
    gameManagerInstance.selectCell(cell.x, cell.y);
  }
});

document.getElementById("swapButton").addEventListener('click',function(event){
  console.log("버튼");
  gameManagerInstance.swapCells();
})



// 교환 버튼 클릭 이벤트 핸들러
function getCellFromEvent(event) {
  var element = event.target;

  // 클릭된 요소가 타일의 내부 요소일 경우 타일 요소를 찾을 때까지 부모 요소를 탐색
  while (element != null && !element.classList.contains('tile')) {
    element = element.parentElement;
  }

  // tile 클래스를 가진 요소를 찾았는지 확인
  if (element && element.classList.contains('tile')) {
    // classList에서 'tile-position-x-y' 형식의 클래스를 찾기
    var positionClass = Array.from(element.classList).find(cls => cls.startsWith('tile-position-'));
    if (positionClass) {
      var matches = positionClass.match(/tile-position-(\d+)-(\d+)/);
      if (matches) {
        var x = parseInt(matches[1], 10);
        var y = parseInt(matches[2], 10);
        if(x==2&&y==120){
          x=0;y=0;
        }
        else if(x==2&&y==90){
          x=1;y=0;
        }
        else if(x==2&&y==60){
          x=2;y=0;
        }
        ///////////////////////////////
        else if(x==2&&y==150){
          x=0;y=1;
        }
        else if(x==1&&y==120){
          x=1;y=1;
        }
        else if(x==1&&y==60){
          x=2;y=1;
        }
        else if(x==2&&y==30){
          x=3;y=1;
        }
        ///////////////////////////////
        else if(x==2&&y==180){
          x=0;y=2;
        }
        else if(x==1&&y==180){
          x=1;y=2;
        }
        else if(x==0&&y==0){
          x=2;y=2;
        }
        else if(x==1&&y==0){
          x=3;y=2;
        }
        else if(x==2&&y==0){
          x=4;y=2;
        }
        /////////////////////////////
        else if(x==2&&y==210){
          x=0;y=3;
        }

        else if(x==1&&y==240){
          x=1;y=3;
        }
        else if(x==1&&y==300){
          x=2;y=3;
        }
        else if(x==2&&y==330){
          x=3;y=3;
        }
        ///////////////////////////////
        else if(x==2&&y==240){
          x=0;y=4;
        }
        else if(x==2&&y==270){
          x=1;y=4;
        }
        else if(x==2&&y==300){
          x=2;y=4;
        }
        return { x: x, y: y };
      }
    }
  }

  return null; // 적절한 타일을 찾지 못한 경우 null 반환
}

