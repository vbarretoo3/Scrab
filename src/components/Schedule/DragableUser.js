import React from 'react';
import { useDrag } from 'react-dnd';

function DraggableUser({ setClickableUser, setModal, user }) {
    const [{ isDragging }, drag] = useDrag({
        type: 'USER',
        item: { user },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    });

    const handleModal = () => {
        setClickableUser(user)
        setModal(true)
    }

    return (
        <div onClick={handleModal}
            ref={drag}
            className="staff-card"
            style={{ opacity: isDragging ? 0.5 : 1 }}
        >
            <strong style={{ fontSize: '14pt'}}>{user.FirstName} {user.LastName}</strong>
            <br/>
            {user.Role}
            <br/>
            <br/>
            {user.Notes}
        </div>
    );
}

export default DraggableUser;
