import { GeoJSON } from 'react-leaflet';

const RoadLayer = ({ data }) => {
    const style = (feature) => ({
        color: '#94A3B8',
        weight: 2,
        opacity: 0.6
    });

    const onEachFeature = (feature, layer) => {
        if (feature.properties && feature.properties['Nama Jalan']) {
            layer.bindTooltip(feature.properties['Nama Jalan'], {
                permanent: false,
                direction: 'center',
                className: 'glass-dark'
            });
        }
    };

    return (
        <GeoJSON
            data={data}
            style={style}
            onEachFeature={onEachFeature}
        />
    );
};

export default RoadLayer;
