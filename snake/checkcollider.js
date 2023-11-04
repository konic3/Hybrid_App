function checkMouseCollisionWithPlayer() {
    if (Player.length > 0 ) {
        var firstPlayer = Player[0];
        var dx = mouseX - firstPlayer.PosX;
        var dy = mouseY - firstPlayer.PosY;
        var distance = Math.sqrt(dx * dx + dy * dy);
        // 마우스와 원 사이의 거리가 원의 크기보다 작은 경우 위치 고정
        if (distance <= firstPlayer.size) {
            firstPlayer.DirX = 0;
            firstPlayer.DirY = 0;
        }
        if (
            firstPlayer.PosX - firstPlayer.size < 0 ||
            firstPlayer.PosX + firstPlayer.size > canvas.width ||
            firstPlayer.PosY - firstPlayer.size < 0 ||
            firstPlayer.PosY + firstPlayer.size > canvas.height
        ) {
            gameover(); // 게임 오버 처리
        }

        //플레이어 몸통 충돌 검사
        if (Player.length >= 4) { // 두 개 이상의 원이 있을 때만 충돌 검사를 수행합니다.
            var firstPlayer = Player[0];
            for (var i = 4; i < Player.length; i++) {
                var otherPlayer = Player[i];
                var dx = firstPlayer.PosX - otherPlayer.PosX;
                var dy = firstPlayer.PosY - otherPlayer.PosY;
                var distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < firstPlayer.size + otherPlayer.size) {
                    // 첫 번째 플레이어 원이 다른 원과 충돌하면 게임 오버
                    gameover();
                }

            }
        }

        //물체 충돌 검사
        var Sx = firstPlayer.PosX - rotatingSquareX;
        var Sy = firstPlayer.PosY - rotatingSquareY;
        var Sdistance = Math.sqrt(Sx * Sx + Sy * Sy);
        var Tx = firstPlayer.PosX - rotatingTriangleX;
        var Ty = firstPlayer.PosY - rotatingTriangleY;
        var Tdistance = Math.sqrt(Tx * Tx + Ty * Ty);
        var Cx = firstPlayer.PosX - rotatingCircleX;
        var Cy = firstPlayer.PosY - rotatingCircleY;
        var Cdistance = Math.sqrt(Cx * Cx + Cy * Cy);

        if (Sdistance <= firstPlayer.size + 50||Tdistance <= firstPlayer.size +40||Cdistance <= firstPlayer.size +20) {
            gameover();
        }
    
    }
}