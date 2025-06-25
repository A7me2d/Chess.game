import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  board: string[][] = [];
  selected: {row: number, col: number} | null = null;
  turn: string = 'w';
  kingMoved: { [key: string]: boolean } = { w: false, b: false };
  rookMoved: { [key: string]: boolean[] } = { w: [false, false], b: [false, false] }; // [left, right]
  allowUserBlackOnce = false;

  ngOnInit() {
    this.resetBoard();
  }

  resetBoard() {
    this.board = [
      ['bR','bN','bB','bK','bQ','bB','bN','bR'],
      ['bP','bP','bP','bP','bP','bP','bP','bP'],
      ['','','','','','','',''],
      ['','','','','','','',''],
      ['','','','','','','',''],
      ['','','','','','','',''],
      ['wP','wP','wP','wP','wP','wP','wP','wP'],
      ['wR','wN','wB','wK','wQ','wB','wN','wR']
    ];
    this.selected = null;
    this.turn = 'w';
    this.kingMoved = { w: false, b: false };
    this.rookMoved = { w: [false, false], b: [false, false] };
  }

  playAsBlackOnce() {
    this.allowUserBlackOnce = true;
    this.turn = 'user-black';
  }

  selectSquare(row: number, col: number) {
    if (this.selected) {
      console.log('movePiece', {from: this.selected, to: {row, col}, turn: this.turn});
      this.movePiece(row, col);
    } else if (this.board[row][col] && ((this.board[row][col][0] === this.turn) || (this.turn === 'user-black' && this.board[row][col][0] === 'b'))) {
      console.log('select', {row, col, piece: this.board[row][col], turn: this.turn});
      this.selected = {row, col};
    } else {
      console.log('رفض اختيار القطعة', {row, col, piece: this.board[row][col], turn: this.turn});
    }
  }

  movePiece(row: number, col: number) {
    if (!this.selected) {
      console.log('movePiece: لا يوجد قطعة محددة');
      return;
    }
    const {row: fromRow, col: fromCol} = this.selected;
    const piece = this.board[fromRow][fromCol];
    if (fromRow === row && fromCol === col) {
      console.log('movePiece: نفس المربع');
      this.selected = null;
      return;
    }
    // دعم التبييت عند الضغط على القلعة بعد الملك
    if (piece[1] === 'K' && fromRow === row && (col === 0 || col === 7)) {
      const homeRow = piece[0] === 'w' ? 7 : 0;
      if (fromRow !== homeRow) {
        console.log('الملك ليس في الصف الأساسي');
      } else if (this.kingMoved[piece[0]]) {
        console.log('الملك تحرك من قبل');
      } else if (col === 7) {
        if (this.rookMoved[piece[0]][1]) console.log('القلعة اليمنى تحركت من قبل');
        else if (this.board[homeRow][5] || this.board[homeRow][6]) console.log('هناك قطع بين الملك والقلعة اليمنى');
        else if (!this.board[homeRow][7] || this.board[homeRow][7][1] !== 'R') console.log('لا توجد قلعة يمين');
      } else if (col === 0) {
        if (this.rookMoved[piece[0]][0]) console.log('القلعة اليسرى تحركت من قبل');
        else if (this.board[homeRow][1] || this.board[homeRow][2]) console.log('هناك قطع بين الملك والقلعة اليسرى');
        else if (!this.board[homeRow][0] || this.board[homeRow][0][1] !== 'R') console.log('لا توجد قلعة يسار');
      }
      // يمين
      if (col === 7 && !this.rookMoved[piece[0]][1] &&
          !this.board[homeRow][5] && !this.board[homeRow][6] &&
          this.board[homeRow][7] && this.board[homeRow][7][1] === 'R') {
        // نفذ التبييت يمين
        this.board[homeRow][6] = piece;
        this.board[fromRow][fromCol] = '';
        this.board[homeRow][5] = this.board[homeRow][7];
        this.board[homeRow][7] = '';
        this.kingMoved[piece[0]] = true;
        this.rookMoved[piece[0]][1] = true;
        this.selected = null;
        this.turn = this.turn === 'w' ? 'b' : 'w';
        if (this.turn === 'b') setTimeout(() => this.computerMove(), 400);
        return;
      }
      // يسار (تعديل الأعمدة)
      if (col === 0 && !this.rookMoved[piece[0]][0] &&
          !this.board[homeRow][1] && !this.board[homeRow][2] &&
          this.board[homeRow][0] && this.board[homeRow][0][1] === 'R') {
        // نفذ التبييت يسار
        this.board[homeRow][1] = piece;
        this.board[fromRow][fromCol] = '';
        this.board[homeRow][2] = this.board[homeRow][0];
        this.board[homeRow][0] = '';
        this.kingMoved[piece[0]] = true;
        this.rookMoved[piece[0]][0] = true;
        this.selected = null;
        this.turn = this.turn === 'w' ? 'b' : 'w';
        if (this.turn === 'b') setTimeout(() => this.computerMove(), 400);
        return;
      }
    }
    // تبييت
    if (piece[1] === 'K' && Math.abs(col - fromCol) === 2 && fromRow === row && this.isValidMove(piece, fromRow, fromCol, row, col)) {
      // الأبيض يبيت في الصف 7، الأسود في الصف 0
      if (col > fromCol) {
        // تبييت يمين
        this.board[row][col] = piece;
        this.board[fromRow][fromCol] = '';
        this.board[row][col-1] = this.board[row][7];
        this.board[row][7] = '';
      } else {
        // تبييت يسار (تعديل الأعمدة)
        this.board[row][col] = piece;
        this.board[fromRow][fromCol] = '';
        this.board[row][col+1] = this.board[row][0];
        this.board[row][0] = '';
      }
      this.kingMoved[piece[0]] = true;
      this.rookMoved[piece[0]][col > fromCol ? 1 : 0] = true;
      this.selected = null;
      this.turn = this.turn === 'w' ? 'b' : 'w';
      if (this.turn === 'b') setTimeout(() => this.computerMove(), 400);
      return;
    }
    if (!this.isValidMove(piece, fromRow, fromCol, row, col)) {
      console.log('movePiece: حركة غير قانونية', {fromRow, fromCol, toRow: row, toCol: col, piece, turn: this.turn});
      if (piece[1] === 'K') console.log('حركة الملك غير قانونية');
      this.selected = null;
      return;
    }
    // Move piece
    this.board[row][col] = piece;
    this.board[fromRow][fromCol] = '';
    // ترقية الجندي
    if (piece[1] === 'P' && (row === 0 || row === 7)) {
      this.board[row][col] = piece[0] + 'Q';
    }
    // تتبع تحريك الملك والقلعة
    if (piece[1] === 'K') this.kingMoved[piece[0]] = true;
    if (piece[1] === 'R') {
      if (fromCol === 0) this.rookMoved[piece[0]][0] = true;
      if (fromCol === 7) this.rookMoved[piece[0]][1] = true;
    }
    // بعد تنفيذ نقلة الأسود بواسطة المستخدم، أعد الدور للأبيض
    if (this.turn === 'user-black') {
      this.selected = null;
      this.turn = 'w';
      this.allowUserBlackOnce = false;
      return;
    }
    this.selected = null;
    this.turn = this.turn === 'w' ? (this.allowUserBlackOnce ? 'user-black' : 'b') : 'w';
    if (this.turn === 'b') setTimeout(() => this.computerMove(), 400);
  }

  computerMove() {
    // استخدم MiniMax لاختيار أفضل حركة للأسود
    const best = this.findBestMove('b', 6); // عمق 6 (أقوى)
    if (!best) return;
    const {fromRow, fromCol, toRow, toCol} = best;
    const piece = this.board[fromRow][fromCol];
    this.board[toRow][toCol] = piece;
    this.board[fromRow][fromCol] = '';
    this.turn = 'w';
  }

  findBestMove(player: 'w'|'b', depth: number) {
    let bestScore = player === 'b' ? -Infinity : Infinity;
    let bestMove = null;
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = this.board[i][j];
        if (piece && piece[0] === player) {
          for (let ii = 0; ii < 8; ii++) {
            for (let jj = 0; jj < 8; jj++) {
              // لا تجرب التبييت إلا إذا كانت الحركة قانونية فعلاً
              if (piece[1] === 'K' && Math.abs(jj - j) === 2 && !this.isValidMove(piece, i, j, ii, jj)) continue;
              if (this.isValidMove(piece, i, j, ii, jj)) {
                const backup = this.board[ii][jj];
                this.board[ii][jj] = piece;
                this.board[i][j] = '';
                const score = this.minimax(depth - 1, player === 'b' ? 'w' : 'b', -Infinity, Infinity);
                this.board[i][j] = piece;
                this.board[ii][jj] = backup;
                if ((player === 'b' && score > bestScore) || (player === 'w' && score < bestScore)) {
                  bestScore = score;
                  bestMove = {fromRow: i, fromCol: j, toRow: ii, toCol: jj};
                }
              }
            }
          }
        }
      }
    }
    return bestMove;
  }

  minimax(depth: number, player: 'w'|'b', alpha: number, beta: number): number {
    if (depth === 0) return this.evaluateBoard();
    let best = player === 'b' ? -Infinity : Infinity;
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = this.board[i][j];
        if (piece && piece[0] === player) {
          for (let ii = 0; ii < 8; ii++) {
            for (let jj = 0; jj < 8; jj++) {
              // لا تجرب التبييت إلا إذا كانت الحركة قانونية فعلاً
              if (piece[1] === 'K' && Math.abs(jj - j) === 2 && !this.isValidMove(piece, i, j, ii, jj)) continue;
              if (this.isValidMove(piece, i, j, ii, jj)) {
                const backup = this.board[ii][jj];
                this.board[ii][jj] = piece;
                this.board[i][j] = '';
                const score = this.minimax(depth - 1, player === 'b' ? 'w' : 'b', alpha, beta);
                this.board[i][j] = piece;
                this.board[ii][jj] = backup;
                if (player === 'b') {
                  best = Math.max(best, score);
                  alpha = Math.max(alpha, best);
                  if (beta <= alpha) return best;
                } else {
                  best = Math.min(best, score);
                  beta = Math.min(beta, best);
                  if (beta <= alpha) return best;
                }
              }
            }
          }
        }
      }
    }
    return best;
  }

  evaluateBoard(): number {
    // تقييم متقدم جدًا: قيمة القطع + تمركز + حماية الملك + سيطرة على المركز + تهديد القطع + حماية القطع + كشف الشيك
    const values: any = {K: 10000, Q: 900, R: 500, B: 330, N: 320, P: 100};
    const centerSquares = [ [3,3],[3,4],[4,3],[4,4] ];
    let score = 0;
    let whiteKing = null, blackKing = null;
    // تحديد مواقع الملوك
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = this.board[i][j];
        if (piece === 'wK') whiteKing = [i, j];
        if (piece === 'bK') blackKing = [i, j];
      }
    }
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = this.board[i][j];
        if (piece) {
          const val = values[piece[1]] || 0;
          let bonus = 0;
          // تمركز القطع في المركز
          if (centerSquares.some(([ci,cj]) => ci === i && cj === j)) bonus += 10;
          // حماية الملك (وجود بيادق حول الملك)
          if (piece[1] === 'K') {
            for (let di = -1; di <= 1; di++) {
              for (let dj = -1; dj <= 1; dj++) {
                if (di === 0 && dj === 0) continue;
                const ni = i + di, nj = j + dj;
                if (ni >= 0 && ni < 8 && nj >= 0 && nj < 8) {
                  const n = this.board[ni][nj];
                  if (n && n[1] === 'P' && n[0] === piece[0]) bonus += 5;
                }
              }
            }
          }
          // سيطرة على المركز
          if (piece[1] !== 'K' && (i === 3 || i === 4) && (j === 3 || j === 4)) bonus += 8;
          // مكافأة الترقية
          if (piece[1] === 'P' && (i === 0 || i === 7)) bonus += 80;
          // تهديد القطع
          for (let ii = 0; ii < 8; ii++) {
            for (let jj = 0; jj < 8; jj++) {
              if ((ii !== i || jj !== j) && this.isValidMove(piece, i, j, ii, jj)) {
                const target = this.board[ii][jj];
                if (target && target[0] !== piece[0]) {
                  // تهديد قطعة
                  bonus += (values[target[1]] || 0) * 0.5;
                }
                // حماية قطعة
                if (target && target[0] === piece[0] && target[1] !== 'K') {
                  bonus += 2;
                }
                // تهديد الملك
                if (target && target[1] === 'K' && target[0] !== piece[0]) {
                  bonus += 100;
                }
              }
            }
          }
          // عقوبة كشف الشيك على الملك الخاص
          if (piece[1] === 'K') {
            let inCheck = false;
            for (let ii = 0; ii < 8; ii++) {
              for (let jj = 0; jj < 8; jj++) {
                const opp = this.board[ii][jj];
                if (opp && opp[0] !== piece[0] && this.isValidMove(opp, ii, jj, i, j)) {
                  inCheck = true;
                }
              }
            }
            if (inCheck) bonus -= 200;
          }
          score += (piece[0] === 'b' ? 1 : -1) * (val + bonus);
        }
      }
    }
    // مكافأة خاصة إذا كان ملك الخصم في وضع مات
    if (whiteKing && this.isKingMated('w', whiteKing[0], whiteKing[1])) score += 100000;
    if (blackKing && this.isKingMated('b', blackKing[0], blackKing[1])) score -= 100000;
    return score;
  }

  isKingMated(color: 'w'|'b', kingRow: number, kingCol: number): boolean {
    // إذا كان الملك في كش ولا يوجد أي حركة قانونية تخرجه من الكش
    if (!this.isKingInCheck(color, kingRow, kingCol)) return false;
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = kingRow + dr, nc = kingCol + dc;
        if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && (!this.board[nr][nc] || this.board[nr][nc][0] !== color)) {
          const orig = this.board[nr][nc];
          this.board[nr][nc] = color + 'K';
          this.board[kingRow][kingCol] = '';
          const inCheck = this.isKingInCheck(color, nr, nc);
          this.board[kingRow][kingCol] = color + 'K';
          this.board[nr][nc] = orig;
          if (!inCheck) return false;
        }
      }
    }
    return true;
  }

  isKingInCheck(color: 'w'|'b', kingRow: number, kingCol: number): boolean {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = this.board[i][j];
        if (piece && piece[0] !== color && this.isValidMove(piece, i, j, kingRow, kingCol)) {
          return true;
        }
      }
    }
    return false;
  }

  isValidMove(piece: string, fromRow: number, fromCol: number, toRow: number, toCol: number): boolean {
    if (!piece) return false;
    const target = this.board[toRow][toCol];
    if (target && target[0] === piece[0]) return false;
    const dr = toRow - fromRow;
    const dc = toCol - fromCol;
    const absDr = Math.abs(dr);
    const absDc = Math.abs(dc);
    switch (piece[1]) {
      case 'K': {
        // تبييت
        // الأبيض يبيت في الصف 7، الأسود في الصف 0
        const homeRow = piece[0] === 'w' ? 7 : 0;
        if (fromRow === homeRow && toRow === homeRow && absDc === 2 && !this.kingMoved[piece[0]]) {
          // يمين
          if (dc === 2 && !this.rookMoved[piece[0]][1] &&
              !this.board[homeRow][5] && !this.board[homeRow][6] &&
              this.board[homeRow][7] && this.board[homeRow][7][1] === 'R') {
            return true;
          }
          // يسار
          if (dc === -2 && !this.rookMoved[piece[0]][0] &&
              !this.board[homeRow][1] && !this.board[homeRow][2] && !this.board[homeRow][3] &&
              this.board[homeRow][0] && this.board[homeRow][0][1] === 'R') {
            return true;
          }
        }
        return absDr <= 1 && absDc <= 1;
      }
      case 'P': {
        const dir = piece[0] === 'w' ? -1 : 1; // الأبيض للأعلى
        // حركة أمامية خطوة واحدة
        if (dc === 0 && dr === dir && !target) return true;
        // أول حركة للجندي: خطوتين
        if (dc === 0 && dr === 2*dir && ((fromRow === 6 && piece[0] === 'w') || (fromRow === 1 && piece[0] === 'b')) && !this.board[fromRow+dir][fromCol] && !target) return true;
        // أكل قطري
        if (absDc === 1 && dr === dir && target && target[0] !== piece[0]) return true;
        return false;
      }
      case 'R':
        if (dr !== 0 && dc !== 0) return false;
        return this.isPathClear(fromRow, fromCol, toRow, toCol);
      case 'N':
        return (absDr === 2 && absDc === 1) || (absDr === 1 && absDc === 2);
      case 'B':
        if (absDr !== absDc) return false;
        return this.isPathClear(fromRow, fromCol, toRow, toCol);
      case 'Q':
        if (dr === 0 || dc === 0 || absDr === absDc) {
          return this.isPathClear(fromRow, fromCol, toRow, toCol);
        }
        return false;
      default:
        return false;
    }
  }

  isPathClear(fromRow: number, fromCol: number, toRow: number, toCol: number): boolean {
    const dr = Math.sign(toRow - fromRow);
    const dc = Math.sign(toCol - fromCol);
    let r = fromRow + dr;
    let c = fromCol + dc;
    while (r !== toRow || c !== toCol) {
      if (this.board[r][c]) return false;
      if (r !== toRow) r += dr;
      if (c !== toCol) c += dc;
    }
    return true;
  }

  getPieceUnicode(piece: string): string {
    const map: any = {
      wK: '♔', wQ: '♕', wR: '♖', wB: '♗', wN: '♘', wP: '♙',
      bK: '♚', bQ: '♛', bR: '♜', bB: '♝', bN: '♞', bP: '♟',
      '': ''
    };
    return map[piece] || '';
  }

  swapKingQueen() {
    // عكس الملك والوزير في صف البداية للأبيض والأسود فقط
    // الأبيض
    const whiteRow = this.board[7];
    [whiteRow[3], whiteRow[4]] = [whiteRow[4], whiteRow[3]];
    // الأسود
    const blackRow = this.board[0];
    [blackRow[3], blackRow[4]] = [blackRow[4], blackRow[3]];
  }
}
