var base = "http://0.0.0.0:3000";

academy = academy ? academy : {};
academy.routes = {
	ajax_login : base + "/login/ajax",
	list_students : base + "/students/list", 
	add_student : base + "/students/add",
	edit_student : base + "/students/edit",
	student_details : base + "/students/detail",
	passports: base + "/passports"
};
