from os.path import join

import numpy as np
import cv2


# WIDTH = 1919
# MID_POINT = 960
# NO_STEPS = 1080

WIDTH = 80
MID_POINT = WIDTH//2
NO_STEPS = 100

order = 4
length = order**3

def probabilitic_nary_counter(length: int, num: int):
    return np.random.choice(range(0, num), length)

frames = []
rule = probabilitic_nary_counter(length, order)
prev_frame = np.ndarray((NO_STEPS, WIDTH), dtype='int16')
prev_frame[:,:] = order-1
prev_frame[0, MID_POINT] = 0

for frame_no in range(150):
    next_frame = np.ndarray((NO_STEPS, WIDTH), dtype='int16')
    
    for step in range(1, NO_STEPS):
        for i in range(1, WIDTH-1):
            x,y,z = prev_frame[step-1, i-1:i+2]
            index = x*(order**2)+y*(order)+z
            next_frame[step, i] = rule[index]

    # next_frame = (next_frame.astype('float16')/(order-1))*255
    try:
        next_frame = cv2.resize(next_frame, (1000, 1000), interpolation=cv2.INTER_NEAREST)
        frames.append(next_frame)
        # cv2.imwrite(join(f'rules_{order}_totalistic_high_res', f'{rule_no}.jpg'), im)
        prev_frame = next_frame
    except:
        print('It broke.')

video = cv2.VideoWriter('test', cv2.VideoWriter_fourcc(*'DIVX'), 1, (1000,1000))
video.write(frames)

# # Release the video file
# video.release()
# cv2.destroyAllWindows()
# print("Video generated successfully!")
