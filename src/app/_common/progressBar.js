import ProgressBar from "progressbar.js/dist/progressbar";

export const ProgressBarAnim = () => {
    const circles = document.querySelectorAll('.dna-cirkle-progress');
    const circleDelay = 2500;

    circles.forEach((item, index) => {
        var bar = new ProgressBar.Circle(item, {
            strokeWidth: 7,
            easing: 'easeInOut',
            duration: 1400,
            delay: circleDelay + (100*index),
            trailWidth: 7,
            step: function(state, circle) {
              var value = Math.round(circle.value() * 100);
              if (value === 0) {
                circle.setText('');
              } else {
                circle.setText(value);
              }
            }
        });
        
        bar.animate(item.dataset.value);
    });


    const lines = document.querySelectorAll('.dna-line-progress-item');
    const lineDelay = 2800;

    lines.forEach((item, index) => {
        var bar = new ProgressBar.Line(item, {
            strokeWidth: 1.72,
            easing: 'easeInOut',
            duration: 1400,
            delay: lineDelay + (100*index),
            trailWidth: 1.72,
            svgStyle: {
              width: '100%',
              height: '100%'
            },
            step: (state, bar) => {
              bar.setText(Math.round(bar.value() * 100) + ' %');
            }
        });
        
        bar.animate(item.dataset.value);
    });
}