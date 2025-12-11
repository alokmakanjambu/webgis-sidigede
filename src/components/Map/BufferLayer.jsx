import { Circle } from 'react-leaflet';
import { getBufferColor } from '../../utils/spatial';

const BufferLayer = ({ facilities, radii }) => {
    return (
        <>
            {facilities.map((facility, idx) => {
                const coords = facility.geometry.coordinates;

                return radii.map((radius, ridx) => (
                    <Circle
                        key={`${idx}-${ridx}`}
                        center={[coords[1], coords[0]]}
                        radius={radius * 1000} // Convert km to meters
                        pathOptions={{
                            fillColor: getBufferColor(radius),
                            fillOpacity: 0.1,
                            color: getBufferColor(radius),
                            weight: 1,
                            opacity: 0.4
                        }}
                    />
                ));
            })}
        </>
    );
};

export default BufferLayer;
