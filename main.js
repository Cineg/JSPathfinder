// globals
const canvas = document.getElementById("canvas_path");
const reset_button = document.getElementById("button_reset_grid");
const brush_change_button = document.getElementById("button_change_brush");
const pathfind_button = document.getElementById("button_pathfinder");
const brush_type_info = document.getElementById("brush_type");
const brushes = ["erase", "destination", "obstacle"];
const canvas_context = canvas.getContext("2d");

let brushState = 1;
let arr = create_grid(50, 50);

const square_width = canvas.offsetWidth / arr.length;
const square_height = canvas.offsetHeight / arr[0].length;

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

pathfind_button.addEventListener("mousedown", function (e) {
	if (find_destinations().length != 2) {
		console.log("need more points");
		return;
	}
	find_path();
});

canvas.addEventListener("mousedown", function (e) {
	update_grid_event(e);
});

// functions
function update_grid(grid, x, y) {
	col = Math.floor(x / square_width);
	row = Math.floor(y / square_height);

	if (brushState == 1 && find_destinations().length == 2) {
		return;
	}
	grid[row][col] = brushState;
}

function get_cursor_position(canv, event) {
	const rect = canv.getBoundingClientRect();
	const x = event.clientX - rect.left;
	const y = event.clientY - rect.top;

	return [x, y];
}

function draw_canvas(data_array) {
	for (let row = 0; row < data_array.length; row++) {
		for (let col = 0; col < data_array[row].length; col++) {
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

function update_grid_event(event) {
	let click_coordinates = get_cursor_position(canvas, event);
	update_grid(arr, click_coordinates[0], click_coordinates[1]);
	draw_canvas(arr);
}

function find_destinations(e) {
	let items = [];
	for (let row = 0; row < arr.length; row++) {
		for (let col = 0; col < arr[row].length; col++) {
			if (arr[row][col] == 1) {
				items.push([row, col]);
			}
		}
	}
	return items;
}

function find_path(e) {
	let queue = [];
	let grid_values = create_grid(50, 50);
	const coordinates = [
		[-1, 0],
		[1, 0],
		[0, -1],
		[0, 1],
	];

	const destinations = find_destinations();
	const startpoint = destinations[0];
	const endpoint = destinations[1];

	queue.push([0, 0, startpoint]);

	while (queue.length > 0) {
		const current_item = queue.shift();
		const current_value = current_item[0];
		const current_coordinates = current_item[2];

		for (let index = 0; index < coordinates.length; index++) {
			const coordinate = coordinates[index];
			const new_value = current_value + 1;

			const new_coordinate = [
				coordinate[0] + current_coordinates[0],
				coordinate[1] + current_coordinates[1],
			];
			if (
				new_coordinate[0] == endpoint[0] &&
				new_coordinate[1] == endpoint[1]
			) {
				return;
			}

			if (new_coordinate[0] < 0 || new_coordinate[1] < 0) {
				continue;
			}
			if (
				new_coordinate[0] >= grid_values.length ||
				new_coordinate[1] >= grid_values[0].length
			) {
				continue;
			}

			if (arr[new_coordinate[0]][new_coordinate[1]] != 0) {
				continue;
			}

			if (
				grid_values[new_coordinate[0]][new_coordinate[1]] <=
					new_value &&
				grid_values[new_coordinate[0]][new_coordinate[1]] != 0
			) {
				continue;
			}

			distance_left =
				Math.pow(
					Math.abs(parseInt([endpoint[0] - new_coordinate[0]])),
					2
				) +
				Math.pow(
					Math.abs(parseInt([endpoint[1] - new_coordinate[1]])),
					2
				);
			queue.push([new_value, distance_left, new_coordinate]);
			grid_values[new_coordinate[0]][new_coordinate[1]] = new_value;

			setTimeout(redraw_path(grid_values), 500);
		}
		queue.sort((a, b) => a[1] - b[1]);
	}
}

function redraw_path(path_grid) {
	for (let row = 0; row < arr.length; row++) {
		for (let col = 0; col < arr[row].length; col++) {
			fill_style = ["black", "white", "red"];

			if (
				path_grid[row][col] != 0 &&
				arr[row][col] != 2 &&
				arr[row][col] != 1
			) {
				canvas_context.fillStyle = "green";
			} else {
				canvas_context.fillStyle = fill_style[arr[row][col]];
			}
			canvas_context.fillRect(
				col * square_width,
				row * square_height,
				square_width,
				square_height
			);
		}
	}
}
