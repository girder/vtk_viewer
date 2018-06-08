import View from 'girder/views/View';

import vtkActor from 'vtk.js/Sources/Rendering/Core/Actor';
import vtkMapper from 'vtk.js/Sources/Rendering/Core/Mapper';
import vtkObjReader from 'vtk.js/Sources/IO/Misc/OBJReader';
import vtkOpenGLRenderWindow from 'vtk.js/Sources/Rendering/OpenGL/RenderWindow';
import vtkRenderWindow from 'vtk.js/Sources/Rendering/Core/RenderWindow';
import vtkRenderWindowInteractor from 'vtk.js/Sources/Rendering/Core/RenderWindowInteractor';
import vtkRenderer from 'vtk.js/Sources/Rendering/Core/Renderer';

import template from '../templates/surfaceView.pug';
import '../stylesheets/surfaceView.styl';

const SurfaceView = View.extend({
    render: function () {
        this.$el.html(template());

        const renderWindow = vtkRenderWindow.newInstance();
        const renderer = vtkRenderer.newInstance();
        renderWindow.addRenderer(renderer);

        const reader = vtkObjReader.newInstance();
        const mapper = vtkMapper.newInstance();
        mapper.setInputConnection(reader.getOutputPort());
        const actor = vtkActor.newInstance();
        actor.setMapper(mapper);
        renderer.addActor(actor);

        const container = this.$('.g-surface-viewer-container');
        const glwindow = vtkOpenGLRenderWindow.newInstance();
        glwindow.setContainer(container[0]);
        renderWindow.addView(glwindow);
        glwindow.setSize(container.width(), container.height());

        const interactor = vtkRenderWindowInteractor.newInstance();
        interactor.setView(glwindow);

        reader.setUrl(this.model.downloadUrl(), {
            fullpath: true,
            progressCallback: (e) => { this._loadProgress(e); }
        }).then(() => {
            renderer.resetCamera();
            renderWindow.render();

            interactor.initialize();
            interactor.bindEvents(container[0]);
            this.$('.g-loading-area').remove();

            return null;
        });

        return this;
    },

    _loadProgress: function (e) {
        const bar = this.$('.g-load-progress>.progress-bar');
        if (e.lengthComputable) {
            const pct = Math.ceil(100 * e.loaded / e.total);
            bar.css('width', `${pct}%`).removeClass('active');
        } else {
            bar.css('width', '100%').addClass('active');
        }
    }
});

export default SurfaceView;
