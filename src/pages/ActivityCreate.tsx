import { useAuth } from '../context/AuthContext';
import { useActivityCreate } from '../hooks/useActivityCreate';

import ActivityForm from '../components/ActivityForm/ActivityForm';

const ActivityCreate = () => {
  const { user } = useAuth();

  const {
    form,
    loading,
    generatingDescription,
    handleChange,
    handleGenerateDescription,
    handleSubmit,
  } = useActivityCreate(user);

  return (
    <div className="w-full max-w-2xl mx-auto rounded-xl px-8 md:px-16 py-8 text-white bg-[#292929] ring-1 ring-black ring-opacity-5 shadow-lg">
      <h1 className="text-3xl font-bold mb-6">Create Activity</h1>

      <ActivityForm
        activity={form}
        loadingSubmit={loading}
        generatingDescription={generatingDescription}
        onChange={handleChange}
        onGenerateDescription={handleGenerateDescription}
        onSubmit={handleSubmit}
        action='create'
      />
    </div>
  );
};

export default ActivityCreate;