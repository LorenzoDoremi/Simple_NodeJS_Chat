
export var conn_users = [];

export function append_user(msg) {

    conn_users.push(msg);


}
export function get_users() {
    return conn_users;
}
export function delete_user(socketid) {
     conn_users.forEach((user) => {
        
        if(user.socket == socketid) {
            conn_users.pop(user);
          
        }
     })
}