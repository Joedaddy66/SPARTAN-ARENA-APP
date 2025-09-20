
import React from 'react';
import { DailyOrder } from '../types';

interface DailyOrdersProps {
  orders: DailyOrder[];
}

const OrderItem: React.FC<{ order: DailyOrder }> = ({ order }) => {
    const progressPercentage = Math.min((order.progress / order.target) * 100, 100);
    const isComplete = order.progress >= order.target;

    return (
        <div className={`p-4 rounded-md transition-all duration-300 ${isComplete ? 'bg-green-900/50 border-green-500' : 'bg-gray-800/70 border-yellow-700/50'} border`}>
            <div className="flex justify-between items-center text-sm mb-2">
                <p className={`font-semibold ${isComplete ? 'text-green-300' : 'text-yellow-300'}`}>{order.description}</p>
                <p className={`font-bold ${isComplete ? 'text-green-300' : 'text-gray-300'}`}>{order.progress} / {order.target}</p>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div 
                    className={`h-2.5 rounded-full transition-all duration-500 ease-out ${isComplete ? 'bg-green-500' : 'bg-yellow-500'}`} 
                    style={{ width: `${progressPercentage}%` }}
                ></div>
            </div>
        </div>
    )
}

const DailyOrders: React.FC<DailyOrdersProps> = ({ orders }) => {
  return (
    <div className="bg-black/50 p-6 rounded-lg border border-yellow-600/50 shadow-lg h-full">
      <h2 className="text-2xl font-bold text-yellow-500 mb-4 text-center border-b-2 border-yellow-700/50 pb-2 uppercase tracking-widest">
        Daily Orders
      </h2>
      <div className="space-y-4">
        {orders.map(order => (
          <OrderItem key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
};

export default DailyOrders;
