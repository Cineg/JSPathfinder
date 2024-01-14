// globals
const canvas = document.getElementById("canvas_path");
const reset_button = document.getElementById("button_reset_grid");
const brush_change_button = document.getElementById("button_change_brush");
const brush_type_info = document.getElementById("brush_type");
const brushes = ["erase", "destination", "obstacle"];
const canvas_context = canvas.getContext("2d");

let brushState = 1;
let destinations = [];
let arr = create_grid(50, 50);
draw_canvas(arr);

// events
reset_button.addEventListener("mousedown", function (e) {
	arr = create_grid(50, 50);
	draw_canvas(arr);
});

brush_change_button.addEventListener("mousedown", function (e) {
	index = brushState;
	index += 1;
	if (index > 2) {
		index = 0;
	}
	brushState = index;
	brush_type_info.textContent = brushes[index];
});

canvas.addEventListener("mousedown", function (e) {
	let click_coordinates = get_cursor_position(canvas, e);
	update_grid(arr, click_coordinates[0], click_coordinates[1]);
	draw_canvas(arr);
});

// functions
function update_grid(grid, x, y) {
	square_width = canvas.offsetWidth / grid.length;
	square_height = canvas.offsetHeight / grid[0].length;

	col = Math.floor(x / square_width);
	row = Math.floor(y / square_height);

	grid[row][col] = brushState;
}

function get_cursor_position(canv, event) {
	const rect = canv.getBoundingClientRect();
	const x = event.clientX - rect.left;
	const y = event.clientY - rect.top;

	console.log("x: " + x, "y: " + y);
	return [x, y];
}

function draw_canvas(data_array) {
	for (let row = 0; row < data_array.length; row++) {
		square_width = canvas.offsetWidth / data_array.length;
		for (let col = 0; col < data_array[row].length; col++) {
			square_height = canvas.offsetHeight / data_array[row].length;
			fill_style = ["black", "white", "red"];

			canvas_context.fillStyle = fill_style[data_array[row][col]];
			canvas_context.fillRect(
				col * square_width,
				row * square_height,
				square_width,
				square_height
			);
		}
	}
}

function create_grid(width, height) {
	grid = [];
	for (let i = 0; i < height; i++) {
		let mini_arr = [];
		for (let j = 0; j < width; j++) {
			mini_arr.push(0);
		}
		grid.push(mini_arr);
	}
	return grid;
}
