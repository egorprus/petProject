export enum FetchStatus {
	error = 'error',
	loading = 'loading',
	success = 'success',
	init = 'init',
}

export enum UserStatus {
	loading = 'loading',
	success = 'success',
	notAuth = 'notAuth',
}

export enum ButtonTypes {
	button = "button",
	submit = "submit",
	reset = "reset",
}

export enum DefaultUrls {
	auth = 'auth',
	registration = 'registration',
	default = '/',
	main = 'content',
	bank = 'bank',
	calendar = 'calendar',
	training = 'training',
	movies = 'movies',
}

export enum TagsListE {
	music = 'music',
	podcasts = 'podcasts',
	jazz = 'jazz',
	hipHop = 'hip-hop',
	audioBooks = 'audioBooks',
	classicFusion = 'classicFusion'
};

export enum RequiredFields {
	login = 'login',
	fullName = 'fullName',
	password = 'password',
	date = 'date',
	expected = 'expected',
	received = 'received',
	startDate = 'startDate',
	endDate = 'endDate',
	description = 'description',
	type = 'type',
	isRecurring = 'isRecurring',
	title = 'title',
	genre = 'genre',
	rating = 'rating',
	notWatched = 'notWatched',
	isSeries = 'isSeries'
};

export enum CalendarEventType {
	birthday = 'birthday',
	meeting = 'meeting',
	task = 'task',
	reminder = 'reminder',
	holiday = 'holiday',
	other = 'other'
}

export enum MovieGenre {
	action = 'action',
	comedy = 'comedy',
	drama = 'drama',
	horror = 'horror',
	sciFi = 'sciFi',
	fantasy = 'fantasy',
	thriller = 'thriller',
	romance = 'romance',
	documentary = 'documentary',
	animation = 'animation',
	other = 'other'
}
