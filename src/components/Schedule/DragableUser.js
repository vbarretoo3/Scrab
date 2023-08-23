import React from 'react';
import { useDrag } from 'react-dnd';

function DraggableUser({ user }) {
    const [{ isDragging }, drag] = useDrag({
        type: 'USER',
        item: { user },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    });

    return (
        <div
            ref={drag}
            className="staff-card"
            style={{ opacity: isDragging ? 0.5 : 1 }}
        >
            {user.Name}
        </div>
    );
}

export default DraggableUser;
