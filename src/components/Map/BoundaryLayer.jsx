import { GeoJSON } from 'react-leaflet';

const BoundaryLayer = ({ data }) => {
    const style = {
        fillColor: '#3B82F6',
        fillOpacity: 0.1,
        color: '#3B82F6',
        weight: 3,
        opacity: 0.8,
        dashArray: '5, 5'
    };

    return (
        <GeoJSON
            data={data}
            style={style}
        />
    );
};

export default BoundaryLayer;
