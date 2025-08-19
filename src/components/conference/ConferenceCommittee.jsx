

const Committee = ({ committee, loading }) => {
  if (loading) {
    return (
      <div className="py-20 text-center text-lg text-gray-500">
        Loading committee...
      </div>
    );
  }

  if (!committee || !committee.groups || committee.groups.length === 0) {
    return (
      <div className="py-20 text-center text-lg text-gray-400">
        No committee members found.
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-6 text-blue-900 text-center">
        {committee.conferenceTitle} Committee
      </h2>
      {committee.groups.map((group, gidx) => (
        <div key={gidx} className="mb-10">
          <h3 className="text-3xl font-bold mb-4">{group.groupName}</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow table-fixed">
              <thead>
                <tr>
                  <th className="px-4 py-3 border-b font-bold text-blue-900 text-left w-12">
                    No
                  </th>
                  <th className="px-4 py-3 border-b font-bold text-blue-900 text-left w-1/3">
                    Full name
                  </th>
                  <th className="px-4 py-3 border-b font-bold text-blue-900 text-left w-1/3">
                    Affiliation
                  </th>
                  <th className="px-4 py-3 border-b font-bold text-blue-900 text-left w-1/4">
                    Position
                  </th>
                </tr>
              </thead>
              <tbody>
                {group.members.map((member, midx) => (
                  <tr key={midx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 border-b h-14 align-top text-sm break-words whitespace-normal">
                      {midx + 1}
                    </td>
                    <td className="px-4 py-3 border-b h-14 align-top text-sm break-words whitespace-normal">
                      {member.displayName}
                    </td>
                    <td className="px-4 py-3 border-b h-14 align-top text-sm break-words whitespace-normal">
                      {member.affiliation}
                    </td>
                    <td className="px-4 py-3 border-b h-14 align-top text-sm break-words whitespace-normal">
                      {member.specificTitle}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Committee;
