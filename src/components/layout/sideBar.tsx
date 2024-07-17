import React from 'react';
import Button from '../button/button';
import Card from '../card/card';
import { CARD_DATA } from '../../../data/mock';

const Sidebar = () => {
  return (
    <div className="w-[300px] h-full flex flex-col bg-white p-4 border-r-2 border-grey_2 pt-20">
      <div className="flex-grow overflow-y-auto scrollbar-hide">
        {CARD_DATA.map((item, index) => (
          <Card
            key={index}
            id={item.id}
            size={item.size}
            tags={item.tags}
            status={item.status}
          />
        ))}
      </div>
      <div className="flex-shrink-0">
        <Button title={'추가하기'} />
      </div>
    </div>
  );
};

export default Sidebar;
