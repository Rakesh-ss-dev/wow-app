const PendingUsers = () => {
  return (
    <div className="bg-white rounded px-2 py-2">
      <div className="flex flex-row justify-between items-center mb-2 mx-1">
        <div className="flex items-center">
          <h2 className="w-max px-1 rounded mr-2 text-gray-700">
            Pending Users
          </h2>
        </div>
      </div>
      <div className="grid grid-rows-2 gap-2">
        <div className="p-2 rounded shadow-sm border-gray-100 border-2">
          <h3 className="text-sm mb-3 text-gray-700">Blog post live</h3>
          <p className="text-xs text-gray-500 mt-2">Jun 21, 2019</p>
          <p className="text-xs text-gray-500 mt-2">2</p>
        </div>
      </div>
    </div>
  );
};

export default PendingUsers;
