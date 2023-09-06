import requests
import json


def get_auth_token(link):
    auth_url = 'http://bhpan.buaa.edu.cn/link/'+link
    res = requests.get(auth_url, allow_redirects=False)
    auth_token = res.cookies.get_dict()[f'link_token:{link}']
    return auth_token

def get_dir_content(docid, auth_header):
    list_url = "http://bhpan.buaa.edu.cn/api/efast/v1/dir/list"
    res = requests.post(list_url, data=json.dumps({
        "docid": docid,
        "sort": "asc",
        "by": "name",
    }), headers=auth_header)
    return res.json()

def to_post_data(save_name, docid, token):
    return {
        "authtype": "QUERY_STRING",
        "docid": docid,
        "rev": "",
        "usehttps": True,
        "savename": save_name,
        "token": token
    }

def get_video_data(link):
    auth_token = get_auth_token(link)
    entry_item_url = 'http://bhpan.buaa.edu.cn/api/efast/v1/entry-item'
    auth_header = {"Authorization": f"Bearer {auth_token}"}
    res = requests.get(entry_item_url, headers=auth_header)
    dir_docid = res.json()[0]['id']
    content = get_dir_content(dir_docid, auth_header)
    ret = []
    for f in content['files']:
        ret.append(to_post_data(f['name'], f['docid'], auth_token))
    return ret

if __name__ == '__main__':
    dump_data = {}
    with open('repos/pulipuli/src/link.json') as f:
        link_data = json.load(f)
        for slug, meta in link_data.items():
            print('Getting video data for', slug)
            data = {}
            for key, value in meta.items():
                if key == 'directory_link':
                    data['videos'] = get_video_data(value)
                else:
                    data[key] = value
            print(f'{len(data["videos"])} videos are found.')
            dump_data[slug] = data
    with open('repos/pulipuli/src/video.json', 'w') as f:
        print('Writing to repos/pulipuli/src/video.json')
        json.dump(dump_data, f, indent=2)
