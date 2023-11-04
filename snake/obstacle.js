var rotationAngle = 0;
        var rotatingSquareX = -80;
        var rotatingSquareY = 100;
        var SquarX;
        var SquarY;
        
        var rotatingTriangleX  = 1480;
        var rotatingTriangleY  = 100;
        var TriangleX=1480;
        var TriangleY=100;

        var rotatingCircleX  = 1480;
        var rotatingCircleY  = 100;
        var CircleX=500;
        var CircleY=1080;

        var dificult = -1;
function Circle(){
    if (CircleX >= 701) {
        rotatingCircleX -= 6+dificult;
    } else {
        rotatingCircleX += 6+dificult;
    }

    if (CircleY >= 501) {
        rotatingCircleY -= 6+dificult;
    } else {
        rotatingCircleY += 6+dificult;
    }

    drawC(rotatingCircleX, rotatingCircleY, rotationAngle);

    if (rotatingCircleX >= 1500 || rotatingCircleX <= -100 || rotatingCircleY >= 1100 || rotatingCircleY <= -100) {
        var randomValue = Math.floor(Math.random() * 3) + 1; // 1부터 3까지의 난수 생성
        if (randomValue === 1) {
            CircleX = -80;
        } else if (randomValue === 2) {
            CircleX = Math.floor(Math.random() * 1401); // 0부터 1400까지의 난수 생성
        } else if (randomValue === 3) {
            CircleX = 1480;
        }
        //y좌표 난수
        if(CircleX<=1||CircleX>=1401){
            rotatingCircleY = Math.floor(Math.random() * 1001); // 0부터 1400까지의 난수 생성
        }else if(CircleX>=0||CircleX<=1400){
            randomValue = Math.floor(Math.random() * 2) + 1; // 1부터 3까지의 난수 생성
            if (randomValue === 1) {
                rotatingCircleY = -80;
            } else if (randomValue === 2) {
                rotatingCircleY = 1080;
            } 
        }
        
        rotatingCircleX=CircleX;
        rotatingCircleY=CircleY;

    }
}
function drawC(x, y) {
    ctx.save();
    ctx.translate(x, y);

    ctx.beginPath();
    ctx.arc(0, 0, 30, 0, 2 * Math.PI); // 중심 좌표 (0, 0)에서 반지름(radius)만큼의 원을 그림

    ctx.fillStyle = "brown"; // 내부색
    ctx.fill(); // 내부를 채우기
    ctx.strokeStyle = 'black'; // 테두리 색상
    ctx.stroke(); // 테두리 그리기

    ctx.restore();
}


function Triangle(){
             
    if (TriangleX >= 701) {
        rotatingTriangleX -= 5+dificult;
    } else {
        rotatingTriangleX += 5+dificult;
    }

    if (TriangleY >= 501) {
        rotatingTriangleY -= 5+dificult;
    } else {
        rotatingTriangleY += 5+dificult;
    }

    // 회전 및 그리기
    drawT(rotatingTriangleX, rotatingTriangleY, rotationAngle);

    if (rotatingTriangleX >= 1500 || rotatingTriangleX <= -100 || rotatingTriangleY >= 1100 || rotatingTriangleY <= -100) {
        var randomValue = Math.floor(Math.random() * 3) + 1; // 1부터 3까지의 난수 생성
        if (randomValue === 1) {
            TriangleX = -80;
        } else if (randomValue === 2) {
            TriangleX = Math.floor(Math.random() * 1401); // 0부터 1400까지의 난수 생성
        } else if (randomValue === 3) {
            TriangleX = 1480;
        }
        //y좌표 난수
        if(TriangleX<=1||TriangleX>=1401){
            TriangleY = Math.floor(Math.random() * 1001); // 0부터 1400까지의 난수 생성
        }else if(TriangleX>=0||TriangleX<=1400){
            randomValue = Math.floor(Math.random() * 2) + 1; // 1부터 3까지의 난수 생성
            if (randomValue === 1) {
                TriangleY = -80;
            } else if (randomValue === 2) {
                TriangleY = 1080;
            } 
        }
        
        rotatingTriangleX=TriangleX;
        rotatingTriangleY=TriangleY;

    }

}
function drawT(x, y, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    // 삼각형 그리기
    ctx.beginPath();
    ctx.moveTo(0, -50);
    ctx.lineTo(50, 50);
    ctx.lineTo(-50, 50);
    ctx.closePath();

    ctx.fillStyle = "purple"; // 내부색
    ctx.fill(); // 내부를 채우기
    ctx.strokeStyle = 'black'; // 테두리 색상
    ctx.stroke(); // 테두리 그리기

    ctx.restore();
}


function Squar(){
    if(SquarX>=701){
        rotatingSquareX-=3+dificult;
    }else{
        rotatingSquareX +=3+dificult;
    }
    if(SquarY>=501){
        rotatingSquareY-=3+dificult;
    }else{
        rotatingSquareY+=3+dificult;
    }

    drawobS(rotationAngle,rotatingSquareX,rotatingSquareY);
    if(rotatingSquareX>=1500||rotatingSquareX<=-100||rotatingSquareY>=1100||rotatingSquareY<=-100){
        //x좌표 난수
        var randomValue = Math.floor(Math.random() * 3) + 1; // 1부터 3까지의 난수 생성
        if (randomValue === 1) {
            SquarX = -80;
        } else if (randomValue === 2) {
            SquarX = Math.floor(Math.random() * 1401); // 0부터 1400까지의 난수 생성
        } else if (randomValue === 3) {
            SquarX = 1480;
        }
        //y좌표 난수
        if(SquarX<=1||SquarX>=1401){
            SquarY = Math.floor(Math.random() * 1001); // 0부터 1400까지의 난수 생성
        }else if(SquarX>=0||SquarX<=1400){
            randomValue = Math.floor(Math.random() * 2) + 1; // 1부터 3까지의 난수 생성
            if (randomValue === 1) {
                SquarY = -80;
            } else if (randomValue === 2) {
                SquarY = 1080;
            } 
        }
        
        rotatingSquareX=SquarX;
        rotatingSquareY=SquarY;

    }
}

function drawobS(angle,rX,rY) {
    var fixedSquareX = 600;
    var fixedSquareY = 600;
    
    ctx.save();
    ctx.translate(rX , rY);
    ctx.rotate(angle);
    ctx.fillStyle = "darkgreen";
    ctx.fillRect(-50, -50, 100, 100);
    ctx.restore();
}