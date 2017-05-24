import SurfaceView from './views/SurfaceView';
import { wrap } from 'girder/utilities/PluginUtils';
import ItemView from 'girder/views/body/ItemView';

wrap(ItemView, 'render', function (render) {
    this.once('g:rendered', function () {
        const vtkView = (this.model.get('meta') || {}).vtkView;
        if (vtkView) {
            this.$('.g-item-header').after('<div class="g-vtk-viewer"></div>');
        } else {
            return;
        }
        if (vtkView === 'surface')
            new SurfaceView({
                el: this.$('.g-vtk-viewer'),
                parentView: this,
                model: this.model
            }).render();
    }, this);
    return render.call(this);
});
