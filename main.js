const { some, range, map } = _;

const image = new Image();
image.src = "./bg.png";
image.onload = () => {
  const canvas = document.getElementById("grid");
  const ctx = canvas.getContext("2d");
  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0);
  makeGrid(
    canvas,
    170,
    150,
    300,
    400,
    true,
    3,
    "#c10000",
    0.8,
    2,
    40,
    "#140e9c",
    0.9
  );
};

/* makeGrid 사용설명서 */
// 캔버스 위에 grid 선을 자유롭게 긋고 캔버스를 리턴하는 함수
// 캔버스 내에서 grid 가 그려질 위치를 x, y, w, h 를 이용해 지정 가능
// grid 선의 간격, 굵기, 색상, 투명도 지정 가능
// grid 바깥 border 선을 on/off 할 수 있으며 굵기, 색상, 투명도 지정 가능
/*
 * canvas_w       : 캔버스 가로 사이즈 (px)
 * canvas_h       : 캔버스 세로 사이즈 (px)
 * grid_x         : grid 가 생성될 x 좌표 (px)
 * grid_y         : grid 가 생성될 y 좌표 (px)
 * grid_w         : grid 가 생성될 가로 길이 (px)
 * grid_h         : grid 가 생성될 세로 길이 (px)
 * is_border      : grid 바깥 border 그릴 것인지 여부 선택 (true / false)
 * border_size    : border 선의 굵기 지정 (px)
 * border_color   : border 선 색상 지정 ("#ffffff")
 * border_opacity : border 선 투명도 지정 (0 ~ 1), border 의 투명도를 지정하면 배경 사진의 제품 윤곽을 mockup 경계와 같이 볼 수 있음
 * line_size      : grid 선의 굵기 지정 (px)
 * line_n         : grid 선의 개수 지정 (#), 숫자가 클 수록 촘촘해짐.
 * line_color     : grid 선 색상 지정 ("#ffffff")
 * line_opacity   : grid 선 투명도 지정(0 ~ 1), grid 선 아래로 배경 이미지가 함께 보여야 할 때 적절히 사용
 * */

function makeGrid(
  canvas,
  grid_x,
  grid_y,
  grid_w,
  grid_h,
  is_border,
  border_size,
  border_color,
  border_opacity,
  line_size,
  line_n,
  line_color,
  line_opacity
) {
  const ctx = canvas.getContext("2d");
  const { width: canvas_w, height: canvas_h } = canvas;
  const interval =
    (Math.max(canvas_w, canvas_h) - line_size * line_n) / (line_n + 1);
  const pixel_arr = ctx.getImageData(0, 0, canvas_w, canvas_h).data;
  const isBetween = (ll, hl) => (val) => val >= ll && val < hl;
  const getIndex = (x, y, w) => (x + y * w) * 4;
  const hexToRGB = (hex) =>
    hex.match(/[A-Za-z0-9]{2}/g).map((v) => parseInt(v, 16));
  line_color = hexToRGB(line_color).concat(line_opacity * 255);
  border_color = hexToRGB(border_color).concat(border_opacity * 255);
  for (let y = 0; y < canvas_h; y++) {
    if (isBetween(grid_y, grid_y + grid_h)(y)) {
      for (let x = 0; x < canvas_w; x++) {
        if (isBetween(grid_x, grid_x + grid_w)(x)) {
          const r_x = x % (interval + line_size);
          const r_y = y % (interval + line_size);
          if (some(isBetween(interval, interval + line_size), [r_x, r_y])) {
            const idx = getIndex(x, y, canvas_w);
            map((n) => (pixel_arr[idx + n] = line_color[n]), range(4));
          }
          if (is_border) {
            if (
              !isBetween(
                grid_x + border_size,
                Math.min(grid_x + grid_w, canvas_w) - border_size
              )(x) ||
              !isBetween(
                grid_y + border_size,
                Math.min(grid_y + grid_h, canvas_h) - border_size
              )(y)
            ) {
              const idx = getIndex(x, y, canvas_w);
              map((n) => (pixel_arr[idx + n] = border_color[n]), range(4));
            }
          }
        }
      }
    }
  }

  ctx.putImageData(new ImageData(pixel_arr, canvas_w, canvas_h), 0, 0);
  return canvas;
}
