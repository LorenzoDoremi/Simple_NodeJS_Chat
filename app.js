
export var conn_users = [];

export function append_user(msg) {

    conn_users.push(msg);


}
export function get_users() {
    return conn_users;
}