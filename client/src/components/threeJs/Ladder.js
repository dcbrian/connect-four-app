import { TweenMax, TimelineMax, Expo } from "gsap/TweenMax"
import React, { Fragment, Component } from 'react'
import * as THREE from 'three'
import '../../componentsCss/three.css'
import '../../index.css'

class Ladder extends Component {

    componentDidMount () {
        const width = this.mount.clientWidth
        const height = this.mount.clientHeight

        const scene = new THREE.Scene()
        scene.updateMatrixWorld(true)

        const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000)
        const renderer = new THREE.WebGLRenderer({ antialias: true })

        var geometry = new THREE.BoxGeometry(3, 1, 3);
        var material = new THREE.MeshLambertMaterial({ color: 0xef4e4e });

        // Handle Click events
        const raycaster = new THREE.Raycaster()
        let mouse = new THREE.Vector2()

        // camera.position.z = 4
        camera.position.set(0, 10, 50)

        // Light
        let light = new THREE.PointLight(0xFFFFFF, 1, 500)
        light.position.set(25, -10, 40)
        scene.add(light)

        renderer.setClearColor('#e5e5e5')
        renderer.setSize(width, height)

        this.meshTab = []
        this.material = material
        this.geometry = geometry
        this.socket = this.props.socket
        this.scene = scene
        this.camera = camera
        this.renderer = renderer
        this.raycaster = raycaster
        this.mouse = mouse

        // Create Podium
        this.expand()

        window.addEventListener('resize', () => {
            const width = this.mount.clientWidth
            const height = this.mount.clientHeight
            this.renderer.setSize(width, height)
            this.camera.aspect = width / height
            this.camera.updateProjectionMatrix()
        })
        window.addEventListener('click', this.onMouseMove)

        this.mount.appendChild(this.renderer.domElement)
        this.start()
    }

    expand = () => {
        for (var i = 0; i < 10; i++) {
            var mesh = new THREE.Mesh(this.geometry, this.material)
            mesh.position.x = - 25 + i * 5
            mesh.position.y = 0
            mesh.position.z = 0
            this.scene.add(mesh)
            this.meshTab.push(mesh)
        }

        // Expand animation
        this.tl = new TimelineMax()
        for (let i = 0; i < this.meshTab.length; i++) {
            let height = (this.meshTab.length - i) * 2 + 1
            this.tl = new TimelineMax();
            this.tl.to(this.meshTab[i].scale, 2, { y: height })
            this.tl.to(this.meshTab[i].position, 2, { y: (height - 1) / 2 }, "=-2")

            // this.tl.to(intersects[i].object.scale, .5, {x: .5, ease: Expo.easeOut})
        }
    }

    componentWillUnmount () {
        window.removeEventListener('resize')
        window.removeEventListener('click')
        this.stop()
        this.mount.removeChild(this.renderer.domElement)
    }

    start = () => {
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate)
        }
    }

    stop = () => {
        cancelAnimationFrame(this.frameId)
    }

    animate = () => {
        this.renderScene()
        this.frameId = window.requestAnimationFrame(this.animate)
    }

    renderScene = () => {
        this.renderer.render(this.scene, this.camera)
    }

    render () {
        return (
            <Fragment>
                <button className='title'>TEST</button>
                <div
                    className='vis'
                    ref={mount => {
                        this.mount = mount
                    }}
                />
            </Fragment>
        )
    }
}

export default Ladder
