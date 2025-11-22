import React from 'react'

const Artist = ({getArtistData}) => {
  return (
    <div>
      <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-4xl font-light text-gray-800 mb-6 py-10 text-center">
              Artist
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-blue-50 border-b-2">
                    <th className="p-3 text-left text-gray-700">Artist</th>
                    <th className="p-3 text-right text-gray-700">Revenue</th>
                    <th className="p-3 text-right text-gray-700">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {getArtistData().map((item, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="p-3">{item.artist}</td>
                      <td className="p-3 text-right">
                        {item.revenue.toFixed(2)}
                      </td>
                      <td className="p-3 text-right">
                        {item.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
    </div>
  )
}


export default Artist
