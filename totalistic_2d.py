from os.path import join

import numpy as np
import cv2


# WIDTH = 1919
# MID_POINT = 960
# NO_STEPS = 1080

WIDTH = 102
HEIGHT = 102
MID_POINT = WIDTH//2

order = 3
length = order**5

def probabilitic_nary_counter(length: int, num: int):
    return np.random.choice(range(0, num), length)

for iteration in range(10):
    frames = []
    rule = probabilitic_nary_counter(length, order)
    prev_frame = np.zeros((HEIGHT, WIDTH), dtype='uint32')
    # prev_frame[:,:] = order-1

    #######################################
    ### SINGLE PIXEL IN CENTER OF IMAGE ###
    #######################################
    prev_frame[HEIGHT//2, WIDTH//2] = order-1
    #######################################

    ##############################################
    ### DIAGONAL LINE TOP-LEFT TO BOTTOM-RIGHT ###
    ##############################################
    # for h in range(0, HEIGHT):
    #     for w in range(0, WIDTH):
    #         if h == w:
    #             prev_frame[h, w] = order-1
    # # # cv2.imshow('test', (prev_frame).astype(np.uint8))
    # # cv2.waitKey(0)
    ##############################################

    output_video = cv2.VideoWriter(join('rules_totalistic_2d', f'test_o{order}_it{iteration}.mp4'), cv2.VideoWriter_fourcc(*"mp4v"), 30, (1000,1000), isColor=False)

    for frame in range(300):
        next_frame = np.copy(prev_frame)
        # next_frame = np.ones((HEIGHT, WIDTH), dtype='uint32')

        for h in range(1, HEIGHT-1):
            for w in range(1, WIDTH-1):
                # |   x   |(h-1,w)|   x   |
                # |(h,w-1)| (h,w) |(h,w+1)|
                # |   x   |(h+1,w)|   x   |
                a = prev_frame[h-1,w]
                b = prev_frame[h,w-1]
                c = prev_frame[h,w]
                d = prev_frame[h,w+1]
                e = prev_frame[h+1,w]

                index = a+b*order+c*(order**2)+d*(order**3)+e*(order**4)
                next_frame[h,w] = rule[index]

        prev_frame = next_frame

        norm_frame = next_frame.astype(np.float64)/(order-1)
        show_frame = cv2.resize((norm_frame*255.0).astype('uint8'), (1000, 1000), interpolation=cv2.INTER_NEAREST)
        output_video.write(show_frame)

    output_video.release()
