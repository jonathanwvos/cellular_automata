from os.path import join

import numpy as np
import cv2


# WIDTH = 1919
# MID_POINT = 960
# NO_STEPS = 1080

WIDTH = 102
HEIGHT = 102
MID_POINT = WIDTH//2

order = 4
length = order**3

def probabilitic_nary_counter(length: int, num: int):
    return np.random.choice(range(0, num), length)

frames = []
rule = probabilitic_nary_counter(length, order)
prev_frame = np.zeros((HEIGHT, WIDTH), dtype='uint32')
prev_frame[:,:] = order-1

######################################
### VERTICAL LINE IN MIDDLE REGION ###
######################################
# prev_frame[1, MID_POINT] = 0
######################################

##############################################
### DIAGONAL LINE TOP-LEFT TO BOTTOM-RIGHT ###
##############################################
# for step in range(0, HEIGHT):
#     for i in range(0, WIDTH):
#         if step == i:
#             prev_frame[step, i] = 0
# # cv2.imshow('test', (prev_frame).astype(np.uint8))
# cv2.waitKey(0)
##############################################

#######################
### CENTERED CIRCLE ###
#######################
prev_frame = prev_frame.astype(np.uint8)
cv2.circle(prev_frame, (HEIGHT//2, WIDTH//2), radius=20, color=(1,1,1), thickness=1)
prev_frame = prev_frame.astype(np.uint32)
#######################

output_video = cv2.VideoWriter(join('rules_totalistic_move', 'test18.mp4'), cv2.VideoWriter_fourcc(*"mp4v"), 30, (1000,1000), isColor=False)

for frame in range(450):
    next_frame = np.zeros((HEIGHT, WIDTH), dtype='uint32')

    for step in range(0, HEIGHT):
        for i in range(1, WIDTH-1):
            # x,y,z = prev_frame[step, max(i-1, 0): min(i+2, WIDTH)]
            index = None
            if i == 0:
                y, z = prev_frame[step, 0:2]
                index = y*(order)+z
            elif i == WIDTH-1:
                x, y = prev_frame[step, i-1:WIDTH-1]
                index = x*(order**2)+y*(order)
            else:
                x,y,z = prev_frame[step, i-1:i+2]
                index = x*(order**2)+y*(order)+z
            # # x,y,z = prev_frame[step, i-1:i+2]
            # index = x*(order**2)+y*(order)+z

            next_frame[step, i] = rule[index]

    prev_frame = next_frame
    # saved_frame = (next_frame[1:HEIGHT-1, 1:WIDTH-1]/(order-1)*255).astype(np.uint8)
    # saved_frame = cv2.resize(saved_frame, (1000, 1000), interpolation=cv2.INTER_NEAREST)
    norm_frame = next_frame.astype(np.float64)/(order-1)
    show_frame = cv2.resize((norm_frame*255.0).astype('uint8'), (1000, 1000), interpolation=cv2.INTER_NEAREST)
    output_video.write(show_frame)

    # cv2.imshow('test', show_frame)
    # cv2.waitKey(0)

output_video.release()
