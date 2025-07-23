from flask_socketio import emit, join_room, leave_room
from backend.extensions import socketio
from flask_jwt_extended import decode_token
from backend.models import Task
from backend.extensions import db

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('join')
def on_join(data):
    room = data.get('room')
    join_room(room)
    emit('status', {'msg': f'Joined room: {room}'}, room=room)

@socketio.on('leave')
def on_leave(data):
    room = data.get('room')
    leave_room(room)
    emit('status', {'msg': f'Left room: {room}'}, room=room)

@socketio.on('task_update')
def handle_task_update(data):
    task_id = data.get('task_id')
    task = Task.query.get(task_id)
    if task:
        # Broadcast updated task to all clients
        emit('task_updated', {
            'task_id': task.id,
            'title': task.title,
            'description': task.description,
            'label': task.label,
            'status': task.status,
            'priority': task.priority,
            'due_date': task.due_date.isoformat() if task.due_date else None,
            'assignee_id': task.assignee_id
        }, broadcast=True)
