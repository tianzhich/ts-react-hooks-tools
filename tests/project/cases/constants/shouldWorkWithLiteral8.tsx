import * as React from 'react';

export const Comp: React.FC = () => {
    const literal = `${1}, ${2}`;
    /*[a]*/ const value = 1 + literal; /*[b]*/

    return (
        <div>
            <span>{value}</span>
        </div>
    );
};
