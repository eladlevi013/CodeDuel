import Swal from 'sweetalert2';

export const openGameEndModal = async (data, router) => {
  return Swal.fire({
    title: data.title,
    text: data.text,
    icon: data.icon,
    timer: 10000,
    buttons: false,
    closeOnClickOutside: false,
    closeOnEsc: false
  }).then(() => {
    router.push('/');
  });
};

export const openRoomCreationModal = () => {
  return Swal.fire({
    title: 'Room Creation',
    text: `Customize your room options below. You can choose to play in Coding Mode or SQL Mode.`,
    icon: 'question',
    confirmButtonText: 'Coding Mode',
    confirmButtonColor: '#39261f',
    showCancelButton: true,
    showDenyButton: true,
    denyButtonText: 'SQL Mode',
    denyButtonColor: '#5e3f34'
  });
};

export const openRoomCreatedModal = roomCode => {
  return Swal.fire({
    title: 'Room Created',
    text: `Share this code with your friend: ${roomCode}`,
    icon: 'success',
    confirmButtonText: 'Copy Room Link',
    confirmButtonColor: '#005ce6'
  });
};

export const openOtherPlayerLeftModal = () => {
  return Swal.fire({
    title: 'Other player left the room',
    text: 'Redirecting to home page...',
    icon: 'warning',
    timer: 5000,
    buttons: false,
    closeOnClickOutside: false,
    closeOnEsc: false
  });
};

export const closeModal = () => {
  Swal.close();
};
