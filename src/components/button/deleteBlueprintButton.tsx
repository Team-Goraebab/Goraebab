'use client';

import { useHostStore } from '@/store/hostStore';

const DeleteBlueprintButton = () => {
  const deleteAllHosts = useHostStore((state) => state.deleteAllHosts);

  const handleDelete = () => {
    if (confirm('설계도를 삭제하시겠습니까?')) {
      deleteAllHosts();
    }
  };

  return (
    <div className="fixed bottom-10 right-[155px] transform translate-x-4 h-[45px] p-3 text-red_6 hover:text-white bg-white hover:bg-red_4 active:bg-red_6 rounded-lg shadow-lg flex items-center justify-between">
      <button className="px-4 py-2 text-center" onClick={handleDelete}>
        Delete All
      </button>
    </div>
  );
};

export default DeleteBlueprintButton;
